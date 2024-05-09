import { ErrorMessageUI } from './ErrorMessageUI';

export class PanelDuplicator {
  private static panelCount: number = 1;
  private errorMessageUI: ErrorMessageUI;
  private panelTemplate: HTMLDivElement;

  constructor(panelTemplate: HTMLDivElement) {
    this.errorMessageUI = new ErrorMessageUI();
    this.panelTemplate = panelTemplate;
  }

  public duplicatePanel(): void {
    const newPanel = this.panelTemplate.cloneNode(true) as HTMLDivElement;
    this.resetInputFields(newPanel);
    this.updateInputAttributes(newPanel, PanelDuplicator.panelCount++);
    this.appendClonedPanel(newPanel);
  }

  private resetInputFields(newPanel: HTMLDivElement): void {
    const inputFields = newPanel.querySelectorAll(
      '.input-field input'
    ) as NodeListOf<HTMLInputElement>;
    inputFields.forEach((input) => {
      input.classList.remove('form-error');
      input.value = '';
    });
  }

  private updateInputAttributes(newPanel: HTMLDivElement, panelCount: number): void {
    const inputFields = newPanel.querySelectorAll('.input-field');
    inputFields.forEach((inputField) => {
      const label = inputField.querySelector('label');
      const input = inputField.querySelector('input');
      input?.addEventListener('input', () => {
        input.classList.remove('form-error');
        this.errorMessageUI.hide();
      });
      if (label && input) {
        const labelFor = label.getAttribute('for');
        if (labelFor) {
          const newId = `${labelFor}-${panelCount}`;
          label.setAttribute('for', newId);
          input.setAttribute('id', newId);
          input.setAttribute('name', `${input.getAttribute('name')}-${panelCount}`);
          input.setAttribute('placeholder', label.textContent || '');
        }
      }
    });
  }

  private appendClonedPanel(newPanel: HTMLDivElement): void {
    const panelContainer = document.querySelector('.panel-container') as HTMLDivElement;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'x';
    removeBtn.classList.add('remove-panel-btn');
    removeBtn.addEventListener('click', () => {
      newPanel.remove();
    });
    panelContainer?.appendChild(newPanel);
    newPanel.appendChild(removeBtn);
  }
}
