export interface DfnColorPickerPopperProps {
  visible: boolean;
  color: string;
}

export interface DfnColorPickerPopperEmits {
  (e: "change", color: string): void;
  (e: "update:visible", visible: boolean): void;
  (e: "close"): void;
}
