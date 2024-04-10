// ErrorMessageUI.ts
export class ErrorMessageUI {
  private messageDiv: HTMLDivElement;

  constructor() {
    this.messageDiv = document.querySelector("[bo-elements='form-message']") as HTMLDivElement;
  }

  public show(message: string): void {
    this.messageDiv.textContent = message;
    this.messageDiv.style.display = 'block';
  }

  public hide(): void {
    this.messageDiv.style.display = 'none';
  }
}
