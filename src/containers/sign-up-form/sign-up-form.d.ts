export type SignUpFormInstance = {
  submit: () => Promise<SignUpFormModel>;
};

export interface SignUpFormModel {
  email: string;
  name: string;
  password: string;
  test: number;
}
