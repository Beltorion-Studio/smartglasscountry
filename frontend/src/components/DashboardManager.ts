import { ApiServices } from 'src/services/ApiServices';
import { ErrorMessageUI } from './ErrorMessageUI';
import {globalSettings} from 'src/settings/globalSettings';

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
    this.errorMessageUI = new ErrorMessageUI();
    this.apiService = new ApiServices(globalSettings.dasboardUrl);
    //this.apiService = new ApiServices('https://backend.beltorion.workers.dev/dashboard');
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
    const responseData = await this.apiService.fetchData();
    return responseData;
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
}
