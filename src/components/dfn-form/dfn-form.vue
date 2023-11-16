<template>
  <el-form ref="elFormRef" v-bind="$props" @validate="handleValidateForm">
    <slot />
  </el-form>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import {
    DfnFormEmits,
    DfnFormProps,
    ElFormValidator,
  } from "@/components/dfn-form/dfn-form.d";
  import { FormInstance } from "element-plus/es/components/form";
  import _ from "lodash";

  const props = withDefaults(defineProps<DfnFormProps>(), {
    inline: false,
    labelPosition: "right",
    labelSuffix: "",
    labelWidth: "",
    hideRequiredAsterisk: false,
    requireAsteriskPosition: "left",
    showMessage: true,
    inlineMessage: false,
    statusIcon: false,
    validateOnRuleChange: true,
    disabled: false,
    scrollToError: false,
  });
  const emits = defineEmits<DfnFormEmits>();

  const elFormRef = ref<FormInstance>();
  const originalModel = _.cloneDeep(props.model);

  const isChangedModel = computed(() => !_.isEqual(originalModel, props.model));

  watch(
    () => isChangedModel.value,
    (changed) => {
      emits("modelChanged", changed);
    },
  );

  function validate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      elFormRef.value?.validate((valid, invalidFields) => {
        if (valid) {
          return resolve(true);
        }
        return reject(invalidFields);
      });
    });
  }

  // function validateSilently() {
  //   return new Promise((resolve, reject) => {
  //     const fields = elFormRef.value?.fields;
  //     let valid = true;
  //     const fieldValidCheckPromises: Promise<boolean>[] = [];
  //     fields?.forEach((field, index) => {
  //       const fieldValidCheckPromise = new Promise<boolean>((res, rej) => {
  //         const validateState = field.validateState;
  //         // const inlineMessage = field.inlineMessage;
  //         field.validate("", (errorMessage) => {
  //           if (errorMessage) {
  //             valid = false;
  //           }
  //           field.validateState = validateState;
  //           // field.inlineMessage = inlineMessage;
  //           valid ? res(true) : rej();
  //         });
  //       });
  //       fieldValidCheckPromises.push(fieldValidCheckPromise);
  //     });
  //     Promise.all(fieldValidCheckPromises)
  //       .then(() => resolve(true))
  //       .catch(() => reject());
  //   });
  // }
  //
  // function updateValidate() {
  //   return validateSilently()
  //     .then(() => {
  //       window.console.log("valid");
  //       emits("update:formValid", true);
  //       return Promise.resolve();
  //     })
  //     .catch((e) => {
  //       window.console.log("invalid");
  //       emits("update:formValid", false);
  //       return Promise.reject(e);
  //     });
  // }
  //
  // const debouncedUpdateValidate = _.debounce(updateValidate, 250, {
  //   leading: true,
  // });
  //
  // watch(() => props.model, debouncedUpdateValidate, {
  //   deep: true,
  //   immediate: true,
  // });

  function submit() {
    return validate()
      .then(() => {
        return props.model;
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  const handleValidateForm: ElFormValidator = (prop, isValid, message) => {
    emits("validate", prop, isValid, message);
    return isValid;
  };

  defineExpose({
    submit,
  });
</script>

<style scoped lang="scss">
  @import "dfn-form";
</style>
