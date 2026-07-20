export interface SelectItem {
    id: string;
    name: string;
    lat?: string | number;
    lng?: string | number;
    image?: string;
}
export default class CustomSelect {
    private triggerBtn;
    private dropdownEl;
    private searchInput;
    private optionsListEl;
    private triggerText;
    private items;
    private onSelectCallback;
    constructor(containerId: string, onSelect: (value: SelectItem) => void);
    private initEvents;
    updateData(newItems: SelectItem[], defaultText: string): void;
    private renderOptions;
    reset(placeholder: string): void;
}
//# sourceMappingURL=customSelect.d.ts.map