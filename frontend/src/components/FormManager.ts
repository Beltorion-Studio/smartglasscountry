import { formSchema } from 'src/models/contactFormSchema';
import { ApiServices } from 'src/services/ApiServices';
import { globalSettings } from 'src/settings/globalSettings';
import { states } from 'src/settings/states';
import { getOrderToken } from '$utils/utilities';

const z = window.Zod;

export class FormManager {
  private form: HTMLFormElement;
  private submitButton: HTMLInputElement;
  private formService: ApiServices;
  private countrySelector: HTMLSelectElement;
  private stateSelector: HTMLSelectElement;
  private statesDropdown: HTMLDivElement;
  private clonedStatesDropDown: HTMLDivElement;

  constructor(formId: string) {
    this.form = document.querySelector(formId) as HTMLFormElement;
    this.submitButton = this.form.querySelector('input[type="submit"]') as HTMLInputElement;
    this.formService = new ApiServices(globalSettings.formUrl);
    this.countrySelector = document.querySelector('#country') as HTMLSelectElement;
    this.stateSelector = document.querySelector('#state') as HTMLSelectElement;
    this.statesDropdown = document.querySelector(
      "[bo-elements='state-selector']"
    ) as HTMLDivElement;
    this.clonedStatesDropDown = this.statesDropdown.cloneNode(true) as HTMLDivElement;
    this.form.addEventListener('submit', (event) => this.handleFormSubmit(event));
    this.form.addEventListener('input', () => this.validateForm());
    this.addEventListenerToCountrytSelector();
    this.statesDropdown.style.display = 'none';
  }

  private validateForm(): void {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    try {
      formSchema.parse(data);
      this.submitButton.disabled = false;
    } catch (error) {
      this.submitButton.disabled = true;
      if (error instanceof z.ZodError) {
        console.error(error.errors);
      }
    }
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!this.submitButton.disabled) {
      const formData = new FormData(this.form);
      const formObject = Object.fromEntries(formData.entries());

      const orderToken = getOrderToken();
      if (!orderToken) return;
      formObject['orderToken'] = orderToken;
      try {
        const response = await this.formService.sendData(formObject);
        if (response.success) {
          window.location.href = response.redirectUrl;
          console.log('Form submitted successfully');
        } else {
          console.error('Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  }

  addEventListenerToCountrytSelector() {
    this.countrySelector.addEventListener('change', (event) => {
      console.log('Country changed to:', this.countrySelector.value);
      if (this.countrySelector.value === 'usa') {
        this.statesDropdown.style.display = 'block';
        this.changeStateOptions(states.statesOfUsa);
      } else if (this.countrySelector.value === 'canada') {
        this.statesDropdown.style.display = 'block';
        this.changeStateOptions(states.provincesAndTerritoriesOfCanada);
      } else {
        this.statesDropdown.style.display = 'none';
      }
    });
  }

  changeStateOptions(statesList: string[]) {
    this.stateSelector.innerHTML = '';
    statesList.forEach((state) => {
      const option = document.createElement('option');
      option.value = state.toLowerCase();
      option.text = state;
      this.stateSelector.add(option);
    });
  }

  hideShowStateSelector(shouldShow: boolean) {
    const parentElement = document.querySelector("[bo-elements='contact-form']");
    if (parentElement) {
      if (shouldShow) {
        parentElement.appendChild(this.clonedStatesDropDown);
      } else if (this.clonedStatesDropDown.parentNode) {
        this.clonedStatesDropDown.remove();
      }
    }
  }

  public initialize(): void {
   this.validateForm();
  }
}
