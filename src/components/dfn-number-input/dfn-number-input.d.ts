export interface DfnNumberInputProps {
  size?: "default" | "small" | "large";
  disabled?: boolean;
  modelValue?: number;
}

export interface DfnNumberInputEmits {
  (e: "update:modelValue", value: number): void;
  (e: "input", value: number): void;
  (e: "blur", focusEvent: FocusEvent): void;
  (e: "focus", focusEvent: FocusEvent): void;
}
