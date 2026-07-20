export default class Modal {
    static overlay;
    static closeBtn;
    static title;
    static description;
    static confirmBtn;
    static cancelBtn;
    static onConfirmCallback;
    static init() {
        if (!this.overlay)
            this.overlay = document.getElementById("modal-overlay");
        if (!this.closeBtn)
            this.closeBtn = document.getElementById("modal-close-btn");
        if (!this.title)
            this.title = document.getElementById("modal-title");
        if (!this.description)
            this.description = document.getElementById("modal-description");
        if (!this.confirmBtn)
            this.confirmBtn = document.getElementById("modal-confirm-btn");
        if (!this.cancelBtn)
            this.cancelBtn = document.getElementById("modal-cancel-btn");
        this.closeBtn?.addEventListener("click", () => this.close());
        this.cancelBtn?.addEventListener("click", () => this.close());
        this.overlay?.addEventListener("click", (e) => {
            if (e.target === this.overlay)
                this.close();
        });
        this.confirmBtn?.addEventListener("click", () => {
            if (this.onConfirmCallback) {
                this.onConfirmCallback();
            }
            this.close();
        });
    }
    static open(title, description, confirmText, cancelText, onConfirm) {
        this.init();
        this.title.innerText = title;
        this.description.innerText = description;
        this.confirmBtn.innerText = confirmText;
        this.cancelBtn.innerText = cancelText;
        this.onConfirmCallback = onConfirm;
        this.overlay.classList.remove("hidden");
    }
    static close() {
        this.overlay.classList.add("hidden");
        this.title.innerText = "";
        this.description.innerText = "";
        this.confirmBtn.innerText = "";
        this.cancelBtn.innerText = "";
        this.onConfirmCallback = () => { };
    }
}
//# sourceMappingURL=modal.js.map