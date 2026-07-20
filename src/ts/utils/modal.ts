export default class Modal {
  private static overlay: HTMLElement;
  private static closeBtn: HTMLElement;
  private static title: HTMLElement;
  private static description: HTMLElement;
  private static confirmBtn: HTMLElement;
  private static cancelBtn: HTMLElement;
  private static onConfirmCallback: (() => void);

  private static init(): void {
    if (!this.overlay) this.overlay = document.getElementById("modal-overlay")!;
    if (!this.closeBtn) this.closeBtn = document.getElementById("modal-close-btn")!;
    if (!this.title) this.title = document.getElementById("modal-title")!;
    if (!this.description) this.description = document.getElementById("modal-description")!;
    if (!this.confirmBtn) this.confirmBtn = document.getElementById("modal-confirm-btn")!;
    if (!this.cancelBtn) this.cancelBtn = document.getElementById("modal-cancel-btn")!;

    this.closeBtn?.addEventListener("click", () => this.close());

    this.cancelBtn?.addEventListener("click", () => this.close());

    this.overlay?.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.confirmBtn?.addEventListener("click", () => {
      if (this.onConfirmCallback) {
        this.onConfirmCallback();
      }
      this.close();
    });
  }

  static open(title: string, description: string, confirmText: string, cancelText: string, onConfirm: () => void): void {
    this.init();
    this.title.innerText = title;
    this.description.innerText = description;
    this.confirmBtn.innerText = confirmText;
    this.cancelBtn.innerText = cancelText;
    this.onConfirmCallback = onConfirm;
    this.overlay.classList.remove("hidden");
  }

  static close(): void {
    this.overlay.classList.add("hidden");
    this.title.innerText = "";
    this.description.innerText = "";
    this.confirmBtn.innerText = "";
    this.cancelBtn.innerText = "";
    this.onConfirmCallback = () => {};
  }
}