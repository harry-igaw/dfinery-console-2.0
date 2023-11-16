<template>
  <div
    :class="[
      'dfn-number-input',
      'el-input',
      { [`el-input--${props.size}`]: props.size },
    ]">
    <div class="el-input__wrapper">
      <input
        class="el-input__inner"
        v-model="inputValue"
        type="number"
        @input="handleInputValue"
        @blur="handleBlurInput"
        @focus="handleFocusInput" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from "vue";
  import {
    DfnNumberInputEmits,
    DfnNumberInputProps,
  } from "./dfn-number-input.d";
  import _ from "lodash";
  import { useFormItem } from "element-plus";

  const props = defineProps<DfnNumberInputProps>();
  const emits = defineEmits<DfnNumberInputEmits>();

  const { formItem } = useFormItem();
  let prevInputValue = 0;
  const inputValue = ref<number>(props.modelValue || 0);
  const allowedInputSet = new Set<string>(_.times(9, String));

  function handleInputValue(e: InputEvent) {
    const inputElement = e.target as HTMLInputElement;
    const inputElementValue = inputElement.value;
    if (e.data === "e") {
      inputValue.value = prevInputValue;
    }
    if (
      e.data &&
      !allowedInputSet.has(e.data as string) &&
      !inputElementValue
    ) {
      inputElement.value = inputValue.value ? inputValue.value.toString() : "";
    } else {
      const numberValue = Number(inputElementValue);
      inputValue.value = numberValue;
      emits("input", numberValue);
      emits("update:modelValue", numberValue);
      formItem?.validate("change", () => undefined);
    }
    prevInputValue = inputValue.value;
  }

  function handleBlurInput(e: FocusEvent) {
    emits("blur", e);
    formItem?.validate("blur", () => undefined);
  }

  function handleFocusInput(e: FocusEvent) {
    emits("focus", e);
    formItem?.validate("focus", () => undefined);
  }

  watchEffect(() => {
    inputValue.value = props.modelValue || 0;
  });
</script>

<style scoped lang="scss">
  @import "dfn-number-input";
</style>
