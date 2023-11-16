export type LoginFormInstance = {
  submit: () => Promise<LoginFormModel>;
};

export interface LoginFormProps {
  disabled: boolean;
}

export interface LoginFormModel {
  email: string;
  password: string;
}
