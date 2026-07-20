export default class Loading {

  private static overlay: HTMLElement;
  private static textEl: HTMLElement;

  private static init(): void {
    if (!this.overlay) this.overlay = document.getElementById("loading-overlay")!;
    if (!this.textEl) this.textEl = document.getElementById("loading-text")!;
  }

  static show(message: string = "Loading"): void {
    this.init();
    if (this.textEl) {
      this.textEl.textContent = message;
    }
    this.overlay?.classList.remove("hidden");
  }

  static hide(): void {
    this.init();
    this.overlay?.classList.add("hidden");
  }

}