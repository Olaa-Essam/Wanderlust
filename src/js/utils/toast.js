export default class Toast {
    static container;
    static init() {
        if (!this.container) {
            this.container = document.getElementById("toast-container");
        }
    }
    static show(message, type = "info", duration = 3000) {
        this.init();
        if (!this.container)
            return;
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
//# sourceMappingURL=toast.js.map