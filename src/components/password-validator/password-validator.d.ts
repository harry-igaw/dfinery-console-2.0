export interface PasswordValidatorProps {
  password: string;
  email: string;
  name: string;
  isValid: boolean;
}

export interface PasswordValidatorEmits {
  (e: "update:isValid", valid: boolean): void;
}

export interface ValidationIconProps {
  isValid: boolean;
}
