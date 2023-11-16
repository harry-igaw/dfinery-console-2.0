import { FormEmits, FormProps } from "element-plus/es/components/form/src/form";
import { FormItemProp } from "element-plus/es/components/form/src/form-item";

export type DfnFormInstance<T> = {
  submit: () => Promise<T>;
};

export type DfnFormProps = FormProps;

// export type DfnFormProps = FormProps & {
//   realtimeValidation: boolean;
//   formValid: boolean;
// };

export type ElFormValidator = FormEmits["validate"];

export interface DfnFormEmits {
  (e: "modelChanged", changed: boolean): void;
  (e: "validate", prop: FormItemProp, isValid: boolean, message: string): void;
  // (e: "update:formValid", formValid: boolean): void;
}
