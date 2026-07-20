export default class Modal {
    private static overlay;
    private static closeBtn;
    private static title;
    private static description;
    private static confirmBtn;
    private static cancelBtn;
    private static onConfirmCallback;
    private static init;
    static open(title: string, description: string, confirmText: string, cancelText: string, onConfirm: () => void): void;
    static close(): void;
}
//# sourceMappingURL=modal.d.ts.map