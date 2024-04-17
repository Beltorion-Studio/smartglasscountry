import { formSchema } from 'src/models/contactFormSchema';
import { ApiServices } from 'src/services/ApiServices';
import { ZodError } from 'zod';

export class FormManager {
  private form: HTMLFormElement;
  private submitButton: HTMLInputElement;
  private formService: ApiServices;

  constructor(formId: string) {
    this.form = document.querySelector(formId) as HTMLFormElement;
    this.submitButton = this.form.querySelector('input[type="submit"]') as HTMLInputElement;
    this.formService = new ApiServices('http://127.0.0.1:8787/form');

    this.form.addEventListener('submit', (event) => this.handleFormSubmit(event));
    this.form.addEventListener('input', () => this.validateForm());
  }

  private validateForm(): void {
    const formData = new FormData(this.form);
    const formObject = Object.fromEntries(formData.entries());

    try {
      formSchema.parse(formObject);
      this.submitButton.disabled = false;
    } catch (error) {
      this.submitButton.disabled = true;
      if (error instanceof ZodError) {
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

      console.log(formObject);
      try {
        const response = await this.formService.sendData(formObject);
        console.log(response)
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

  public initialize(): void {
    this.validateForm();
  }
}
