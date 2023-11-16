import { computed, ComputedRef, Ref } from "vue";
import {
  checkPasswordIncludesConsecutive,
  checkPasswordEmpty,
  checkPasswordIncludesLowerCase,
  checkPasswordIncludesNumber,
  checkPasswordIncludesSpecialChar,
  checkPasswordIncludesUpperCase,
  checkPasswordLength,
  checkPasswordIncludesRepeatedCharacter,
} from "@/validators/password-validator";

export function usePasswordValidation(
  password: Ref<string> | ComputedRef<string>,
  min: number,
  max: number,
) {
  const isEmpty = computed(() => checkPasswordEmpty(password.value));
  const isLengthValid = computed(() =>
    checkPasswordLength(password.value, min, max),
  );
  const includesLowerCase = computed(() =>
    checkPasswordIncludesLowerCase(password.value),
  );
  const includesUpperCase = computed(() =>
    checkPasswordIncludesUpperCase(password.value),
  );
  const includesSpecialCharacter = computed(() =>
    checkPasswordIncludesSpecialChar(password.value),
  );
  const includesNumber = computed(() =>
    checkPasswordIncludesNumber(password.value),
  );
  const includesRepeatedCharacter = computed(() =>
    checkPasswordIncludesRepeatedCharacter(password.value),
  );
  const includesConsecutive = computed(() =>
    checkPasswordIncludesConsecutive(password.value),
  );

  return {
    isEmpty,
    isLengthValid,
    includesLowerCase,
    includesUpperCase,
    includesSpecialCharacter,
    includesNumber,
    includesRepeatedCharacter,
    includesConsecutive,
  };
}
