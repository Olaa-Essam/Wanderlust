export type TToastType = "success" | "error" | "info";
export default class Toast {
    private static container;
    private static init;
    static show(message: string, type?: TToastType, duration?: number): void;
}
//# sourceMappingURL=toast.d.ts.map