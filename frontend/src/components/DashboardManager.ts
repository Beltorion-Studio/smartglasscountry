import { ApiServices } from 'src/services/ApiServices';
import { ErrorMessageUI } from './ErrorMessageUI';
import { globalSettings } from 'src/settings/globalSettings';

export class DashboardManager {
  private dashboardValues: Record<string, string> = {};
  private apiService: ApiServices;
  private dashboardInputs: HTMLInputElement[];
  private errorMessageUI: ErrorMessageUI;

  constructor() {
    this.dashboardInputs = Array.from(
      document.querySelectorAll('[data-dashboard]')
    ) as HTMLInputElement[];
    this.setupSaveButtonListener();
    this.setupLogOutButtonListener();
    this.errorMessageUI = new ErrorMessageUI();
    //this.apiService = new ApiServices(globalSettings.dasboardUrl);
    this.apiService = new ApiServices('https://backend.beltorion.workers.dev/dashboard');
   // this.apiService = new ApiServices('http://127.0.0.1:8787/dashboard');
    this.initializeDashboardValues().catch(console.error);
  }

  private async initializeDashboardValues(): Promise<void> {
    try {
      const dashboardData = await this.fetchDashboardValues();
      this.setDashboardValues(dashboardData);
    } catch (error) {
      console.error('Error initializing dashboard values:', error);
      this.errorMessageUI.show('Error initializing dashboard values: ' + error);
    }
  }

  async fetchDashboardValues(): Promise<Record<string, string>> {
    const token: string = window.sessionStorage.getItem('jwt') || '';

    if (!token) {
      this.redirectToLogin();
      return Promise.resolve({});
    }

    try {
      const response = await fetch('https://backend.beltorion.workers.dev/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem('jwt');
        this.redirectToLogin();
        return Promise.resolve({});
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: Record<string, string> = await response.json();
      return responseData;
      // Handle your response data here
    } catch (error) {
      console.error('Error fetching dasboard data:', error);
      return Promise.reject(error);
    }
    //const responseData = await this.apiService.fetchData();
  }

  setDashboardValues(responseData: Record<string, string>): void {
    this.dashboardValues = responseData;
    this.dashboardInputs.forEach((input) => {
      const key = input.dataset.dashboard;
      if (key && responseData.hasOwnProperty(key)) {
        input.value = responseData[key];
      }
    });
  }

  collectDashboardValues(): Record<string, string> {
    const dashboardValues: Record<string, string> = {};

    this.dashboardInputs.forEach((dashboardValue) => {
      const key = dashboardValue.dataset.dashboard;
      const value = dashboardValue.value;
      if (key) {
        dashboardValues[key] = value;
      }
    });
    return dashboardValues;
  }

  async saveDashboardValues(): Promise<void> {
    try {
      const dashboardData = this.collectDashboardValues();
      const responseData = await this.submitDashboard(dashboardData);
      console.log('Dashboard submitted successfully:', responseData);
      this.setDashboardValues(responseData);
    } catch (error) {
      console.error('Error saving dashboard values:', error);
      this.errorMessageUI.show('Error saving dashboard values: ' + error);
    }
  }

  setupSaveButtonListener(): void {
    const saveBtn = document.querySelector("[bo-elements='saveBtn']") as HTMLButtonElement;
    saveBtn.addEventListener('click', () => this.saveDashboardValues());
  }

  private async submitDashboard(
    dashboardData: Record<string, string>
  ): Promise<Record<string, string>> {
    const response = await this.apiService.sendData(dashboardData);
    return response;
  }

  setupLogOutButtonListener(): void {
    const logOutBtn = document.querySelector("[bo-elements='logOutBtn']") as HTMLButtonElement;
    logOutBtn.addEventListener('click', () => this.logOUt());
  }

  private logOUt() {
    sessionStorage.removeItem('jwt');
    location.assign('/smart-center/log-in');
  }

  private redirectToLogin() {
    location.assign('/smart-center/log-in');
  }
}
