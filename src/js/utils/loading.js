export default class Loading {
    static overlay;
    static textEl;
    static init() {
        if (!this.overlay)
            this.overlay = document.getElementById("loading-overlay");
        if (!this.textEl)
            this.textEl = document.getElementById("loading-text");
    }
    static show(message = "Loading") {
        this.init();
        if (this.textEl) {
            this.textEl.textContent = message;
        }
        this.overlay?.classList.remove("hidden");
    }
    static hide() {
        this.init();
        this.overlay?.classList.add("hidden");
    }
}
//# sourceMappingURL=loading.js.map