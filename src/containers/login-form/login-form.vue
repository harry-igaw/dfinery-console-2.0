<template>
  <DfnForm
    ref="dfnFormRef"
    :model="formModel"
    class="login-form"
    size="large"
    label-position="top">
    <ElFormItem prop="email" label="이메일" :rules="emailFormRules">
      <ElInput v-model="formModel.email" placeholder="이메일을 입력하세요.">
      </ElInput>
    </ElFormItem>

    <ElFormItem prop="password" label="비밀번호" :rules="passwordFormRules">
      <ElInput
        v-model="formModel.password"
        type="password"
        placeholder="비밀번호를 입력하세요.">
      </ElInput>
    </ElFormItem>
  </DfnForm>
</template>

<script setup lang="ts">
  import { LoginFormModel, LoginFormProps } from "./login-form.d";
  import { useDfnForm } from "@/composables/use-dfn-form";
  import DfnForm from "@/components/dfn-form/dfn-form.vue";
  import { FormItemRule } from "element-plus/es/components/form/src/types";
  import { InternalRuleItem } from "async-validator/dist-types/interface";

  const props = defineProps<LoginFormProps>();

  const { dfnFormRef, formModel, submit } = useDfnForm<LoginFormModel>({
    email: "",
    password: "",
  });

  const emailFormRules: FormItemRule = {
    asyncValidator: async (
      rule: InternalRuleItem,
      value: string,
      callback: (error?: string | Error) => void,
    ) => {
      if (value === "") {
        return callback(new Error("이메일을 입력하세요."));
      }
      if (!/^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
        return callback(new Error("올바른 이메일을 입력하세요."));
      }
      return callback();
    },
    trigger: ["change", "blur"],
  };

  const passwordFormRules: FormItemRule = {
    validator: (
      rule: InternalRuleItem,
      value: string,
      callback: (error?: string | Error) => void,
    ) => {
      if (value === "") {
        return callback(new Error("비밀번호를 입력하세요."));
      }
      return callback();
    },
    trigger: ["change", "blur"],
  };

  defineExpose({
    submit,
  });
</script>

<style scoped lang="scss">
  @import "./login-form.scss";
</style>
