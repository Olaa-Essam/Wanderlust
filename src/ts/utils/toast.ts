export type TToastType = "success" | "error" | "info";

export default class Toast {
  private static container: HTMLElement;

  private static init(): void {
    if (!this.container) {
      this.container = document.getElementById("toast-container")!;
    }
  }

  static show(message: string, type: TToastType = "info", duration: number = 3000): void {
    this.init();
    if (!this.container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`; 

    const icons = {
      success: '<i class="fa-solid fa-circle-check"></i>',
      error: '<i class="fa-solid fa-circle-xmark"></i>',
      info: '<i class="fa-solid fa-circle-info"></i>',
    };

    toast.innerHTML = `
      ${icons[type]}
      <span>${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, duration);
  }
}