export function checkPasswordEmpty(value: string): boolean {
  return value === "";
}

export function checkPasswordLength(
  value: string,
  min: number,
  max: number,
): boolean {
  const valueLength = value.length;
  return valueLength >= min && valueLength <= max;
}

export function checkPasswordIncludesLowerCase(value: string): boolean {
  return /[a-z]/.test(value);
}

export function checkPasswordIncludesUpperCase(value: string): boolean {
  return /[A-Z]/.test(value);
}

export function checkPasswordIncludesSpecialChar(value: string): boolean {
  return /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(value);
}

export function checkPasswordIncludesNumber(value: string): boolean {
  return /[0-9]/.test(value);
}

const REGEX_ALPHA_NUMBER = /[0123456789a-zA-Z]/;
const REGEX_REPEAT_CHAR = /(.)\1{3,}/;

export function checkPasswordIncludesConsecutive(password: string): boolean {
  const passwordArr = password.split("");
  const consecutiveArr: string[] = [];

  // consecutiveCount 4 이상인 경우 연속된 문자열
  const consecutiveCount = passwordArr.reduce((count, char, index) => {
    if (index > 0) {
      // 현재 문자 유니코드
      const currentUniCode = char.charCodeAt(0);
      // 이전 문자 유니코드
      const prevUniCode = passwordArr[index - 1].charCodeAt(0);
      // a-z, 0-9, A-Z
      const isChar = REGEX_ALPHA_NUMBER.test(char);

      // 현재 문자와 이전 문자가 연속되는지 체크
      if (currentUniCode === prevUniCode + 1 && isChar) {
        return count + 1;
      } else if (count >= 4) {
        // 연속된 문자열 push
        consecutiveArr.push(passwordArr.slice(index - count, index).join(""));
      }
    }
    return 1;
  }, 1);

  // reduce에서 마지막 else if에 들어가지 않는 케이스 고려
  return consecutiveCount >= 4;
}

export function checkPasswordIncludesRepeatedCharacter(
  password: string,
): boolean {
  return REGEX_REPEAT_CHAR.test(password);
}

export function validatePassword(value: string, min = 8, max = 20): boolean {
  return (
    checkPasswordEmpty(value) &&
    checkPasswordLength(value, min, max) &&
    checkPasswordIncludesLowerCase(value) &&
    checkPasswordIncludesUpperCase(value) &&
    checkPasswordIncludesSpecialChar(value) &&
    checkPasswordIncludesNumber(value) &&
    !checkPasswordIncludesRepeatedCharacter(value) &&
    !checkPasswordIncludesConsecutive(value)
  );
}
