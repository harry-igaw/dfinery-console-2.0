<template>
  <div class="password-validator">
    <ul class="validation-list">
      <li class="validation-list-item">
        <validation-icon :is-valid="isCaseRuleValid" />
        영문 대/소문자 포함
      </li>
      <li>
        <validation-icon :is-valid="isMinLengthRuleValid" />
        최소 8자 이상
      </li>
      <li>
        <validation-icon :is-valid="isRepetitionOrConsecutiveRuleValid" />
        연속, 동일 숫자/문자 금지
      </li>
      <li>
        <validation-icon :is-valid="isNumberOrSpecialCharRuleValid" />
        숫자, 특수 기호 각 1개 이상
      </li>
      <li>
        <validation-icon :is-valid="isIdOrNameRuleValid" />
        아이디, 이름 포함 불가
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";
  import {
    PasswordValidatorProps,
    PasswordValidatorEmits,
  } from "@/components/password-validator/password-validator";
  import ValidationIcon from "@/components/password-validator/validation-icon.vue";
  import { usePasswordValidation } from "@/composables/use-password-validation";

  const props = defineProps<PasswordValidatorProps>();
  const emits = defineEmits<PasswordValidatorEmits>();

  const password = computed(() => props.password);
  const {
    isEmpty,
    isLengthValid,
    includesLowerCase,
    includesUpperCase,
    includesSpecialCharacter,
    includesNumber,
    includesRepeatedCharacter,
    includesConsecutive,
  } = usePasswordValidation(password, 8, 20);

  const isCaseRuleValid = computed(
    () => !isEmpty.value && includesLowerCase.value && includesUpperCase.value,
  );
  const isMinLengthRuleValid = computed(
    () => !isEmpty.value && isLengthValid.value,
  );
  const isRepetitionOrConsecutiveRuleValid = computed(
    () =>
      !isEmpty.value &&
      !includesRepeatedCharacter.value &&
      !includesConsecutive.value,
  );
  const isNumberOrSpecialCharRuleValid = computed(
    () =>
      !isEmpty.value && includesNumber.value && includesSpecialCharacter.value,
  );
  const idFromEmail = computed(() => {
    const matched = props.email.match(/(.*)@/);
    return matched ? matched[1] : null;
  });
  const isIdOrNameRuleValid = computed(
    () =>
      !isEmpty.value &&
      (!props.name || !props.password.includes(props.name)) &&
      (!idFromEmail.value || !props.password.includes(idFromEmail.value)),
  );

  const isPasswordValid = computed(
    () =>
      isCaseRuleValid.value &&
      isMinLengthRuleValid.value &&
      isRepetitionOrConsecutiveRuleValid.value &&
      isNumberOrSpecialCharRuleValid.value &&
      isIdOrNameRuleValid.value,
  );

  watch(
    () => isPasswordValid.value,
    (isValid) => {
      emits("update:isValid", isValid);
    },
    { immediate: true },
  );
</script>

<style scoped lang="scss">
  @import "password-validator";
</style>
