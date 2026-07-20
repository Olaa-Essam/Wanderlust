export interface SelectItem {
  id: string;
  name: string;
  lat?: string | number;
  lng?: string | number;
  image?: string;
}

export default class CustomSelect {
  private triggerBtn!: HTMLButtonElement;
  private dropdownEl!: HTMLElement;
  private searchInput: HTMLInputElement | null = null;
  private optionsListEl!: HTMLElement;
  private triggerText!: HTMLElement;
  
  private items: SelectItem[] = [];
  private onSelectCallback!: (value: SelectItem) => void;

  constructor(containerId: string, onSelect: (value: SelectItem) => void) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`CustomSelect: Container with ID "${containerId}" not found.`);
      return;
    }

    this.triggerBtn = container.querySelector(".custom-select-trigger") as HTMLButtonElement;
    this.dropdownEl = container.querySelector(".custom-options-dropdown")!;
    this.optionsListEl = container.querySelector(".custom-options-list")!;
    this.triggerText = container.querySelector(".custom-select-trigger span")!;
    const searchEl = container.querySelector(".dropdown-search-wrapper input");
    if (searchEl) {
      this.searchInput = searchEl as HTMLInputElement;
    }

    this.onSelectCallback = onSelect;
    this.initEvents();
  }

  private initEvents(): void {
    this.triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      
      document.querySelectorAll(".custom-options-dropdown").forEach(el => {
        if (el !== this.dropdownEl) el.classList.add("hidden");
      });
      
      this.dropdownEl.classList.toggle("hidden");
      
      if (!this.dropdownEl.classList.contains("hidden") && this.searchInput) {
        this.searchInput.focus();
      }
    });

    document.addEventListener("click", () => {
      this.dropdownEl.classList.add("hidden");
    });

    this.dropdownEl.addEventListener("click", (e) => e.stopPropagation());

    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => {
        const query = this.searchInput!.value.toLowerCase().trim();
        const filtered = this.items.filter(item => item.name.toLowerCase().includes(query));
        this.renderOptions(filtered);
      });
    }
  }

  public updateData(newItems: SelectItem[], defaultText: string): void {
    this.items = newItems;
    if (this.searchInput) {
      this.searchInput.value = "";
    }
    this.triggerText.textContent = defaultText;
    this.renderOptions(this.items);
  }

  private renderOptions(itemsToRender: SelectItem[]): void {
    this.optionsListEl.innerHTML = "";

    if (itemsToRender.length === 0) {
      this.optionsListEl.innerHTML = `
        <div style="padding: 0.75rem; color: #94a3b8; font-size: 0.9rem; text-align: center;">
          No results found
        </div>
      `;
      return;
    }

    itemsToRender.forEach(item => {
      const optionRow = document.createElement("div");
      optionRow.className = "custom-option-item";

      const mediaHtml = item.image 
        ? `<img src="${item.image}" class="option-flag" alt="${item.name}">`
        : ``;

      optionRow.innerHTML = `
        <div class="option-left-content">
          ${mediaHtml}
          <span class="option-name">${item.name}</span>
        </div>
        <span class="option-code">${item.image ? item.id.toUpperCase() : ''}</span>
      `;

      optionRow.addEventListener("click", () => {
        this.triggerText.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${item.image ? `<img src="${item.image}" style="width: 20px; border-radius: 2px;">` : ''}
            <span>${item.name}</span>
          </div>
        `;
        
        this.dropdownEl.classList.add("hidden");
        this.onSelectCallback(item);
      });

      this.optionsListEl.appendChild(optionRow);
    });
  }

  public reset(placeholder: string): void {
    this.items = [];
    this.optionsListEl.innerHTML = "";
    this.triggerText.textContent = placeholder;
    if (this.searchInput) {
      this.searchInput.value = "";
    }
  }
}