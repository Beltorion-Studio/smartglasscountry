import { cloneNode } from '@finsweet/ts-utils';

function duplicatePanel(): void {
    const addPanelBtn = document.querySelector("[bo-elements='addPanel']");
    if (!addPanelBtn) return;
  
    let panelCount = 1;
  
    setupAddPanelClickListener(addPanelBtn, () => handlePanelDuplication(panelCount++));
  
    function setupAddPanelClickListener(
      addPanelBtn: Element,
      handlePanelDuplication: () => void
    ): void {
      addPanelBtn.addEventListener('click', handlePanelDuplication);
    }
  
    function handlePanelDuplication(panelCount: number): void {
      const productPanel = document.querySelector("[bo-elements='product-panel']") as HTMLDivElement;
      if (!productPanel) return;
  
      const newPanel = cloneNode(productPanel);
      resetInputFields(newPanel);
      updateInputAttributes(newPanel, panelCount);
      appendClonedPanel(productPanel, newPanel);
    }
  
    function resetInputFields(newPanel: HTMLDivElement): void {
      const inputFields = newPanel.querySelectorAll(
        '.input-field input'
      ) as NodeListOf<HTMLInputElement>;
      inputFields.forEach((input: HTMLInputElement) => (input.value = ''));
    }
  
    function updateInputAttributes(newPanel: HTMLDivElement, panelCount: number): void {
      const inputFields = newPanel.querySelectorAll('.input-field');
      inputFields.forEach((inputField) => {
        const label = inputField.querySelector('label');
        const input = inputField.querySelector('input');
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
  
  
    function appendClonedPanel(productPanel: HTMLDivElement, newPanel: HTMLDivElement): void {
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'x';
      removeBtn.classList.add('remove-panel-btn');
      removeBtn.addEventListener('click', () => {
        newPanel.remove();
      });
      productPanel.parentNode?.appendChild(newPanel);
      newPanel.appendChild(removeBtn);
    }
  }

  export  {duplicatePanel}