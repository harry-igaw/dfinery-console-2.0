export interface DfnColorPickerProps {
  color: string;
  disabled?: boolean;
}

export interface DfnColorPickerEmits {
  (e: "update:color", color: string): void;
}
