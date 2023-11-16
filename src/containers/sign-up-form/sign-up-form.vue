<template>
  <DfnForm
    ref="dfnFormRef"
    :model="formModel"
    v-model:form-valid="formValid"
    class="sign-up-form"
    label-position="top">
    <ElFormItem prop="email" label="이메일" :rules="emailFormRules">
      <div class="email-input-button-wrapper">
        <ElInput v-model="formModel.email"></ElInput>
        <ElButton>인증요청</ElButton>
      </div>
    </ElFormItem>

    <ElFormItem prop="name" label="이름" :rules="nameFormRules">
      <ElInput v-model="formModel.name"></ElInput>
    </ElFormItem>

    <ElFormItem
      prop="password"
      label="비밀번호"
      :rules="passwordFormRules"
      :show-message="false">
      <ElInput v-model="formModel.password" type="password"></ElInput>
    </ElFormItem>

    <ElFormItem prop="test" label="Test Number" :rules="testRules">
      <DfnNumberInput v-model="formModel.test"></DfnNumberInput>
    </ElFormItem>

    <password-validator
      v-model:isValid="isPasswordValid"
      :password="formModel.password"
      :email="formModel.email"
      :name="formModel.name">
    </password-validator>
  </DfnForm>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { SignUpFormModel } from "@/containers/sign-up-form/sign-up-form.d";
  import { FormItemRule } from "element-plus/es/components/form/src/types";
  import { InternalRuleItem } from "async-validator/dist-types/interface";
  import PasswordValidator from "@/components/password-validator/password-validator.vue";
  import DfnForm from "@/components/dfn-form/dfn-form.vue";
  import DfnNumberInput from "@/components/dfn-number-input/dfn-number-input.vue";
  import { useDfnForm } from "@/composables/use-dfn-form";

  const { dfnFormRef, formModel, submit } = useDfnForm<SignUpFormModel>({
    email: "",
    name: "",
    password: "",
    test: 0,
  });
  const isPasswordValid = ref<boolean>(false);
  const formValid = ref<boolean>(false);

  const emailFormRules: FormItemRule = {
    asyncValidator: async (
      rule: InternalRuleItem,
      value: string,
      callback: (error?: string | Error) => void,
    ) => {
      if (value === "") {
        return callback(new Error("이메일을 입력하세요."));
      }
      if (await checkEmailDuplicated()) {
        return callback(new Error("이메일이 중복되었습니다."));
      }
      if (!/^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
        return callback(new Error("이메일 형식이 올바르지 않습니다."));
      }
      return callback();
    },
    trigger: ["change", "blur"],
  };

  const nameFormRules: FormItemRule = {
    validator: (
      rule: InternalRuleItem,
      value: string,
      callback: (error?: string | Error) => void,
    ) => {
      if (value === "") {
        return callback(new Error("이름을 입력하세요"));
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
      if (!isPasswordValid.value) {
        return callback(new Error());
      }
      return callback();
    },
    trigger: ["change", "blur"],
  };

  const testRules: FormItemRule = {
    validator: (
      rule: InternalRuleItem,
      value: string,
      callback: (error?: string | Error) => void,
    ) => {
      if (formModel.test < 10) {
        return callback(new Error("10 이상 숫자를 입력하세요"));
      }
      return callback();
    },
    trigger: ["change", "blur"],
  };

  function checkEmailDuplicated(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  defineExpose({
    submit,
  });
</script>

<style scoped lang="scss">
  @import "sign-up-form";
</style>
