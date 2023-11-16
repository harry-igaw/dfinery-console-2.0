<template>
  <h2>DfnColorPicker</h2>
  <DfnColorPicker v-model:color="color">
    <template v-slot:icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.5035 3.9003C16.1834 3.22038 17.3022 3.17714 18.0019 3.87678L20.1232 5.9981C20.8228 6.69774 20.7796 7.81658 20.0997 8.49649L9.32516 19.271C9.05212 19.5441 8.6978 19.7243 8.3144 19.7812L4.99383 20.2733C4.87478 20.291 4.79225 20.3098 4.71725 20.3269C4.70817 20.329 4.69921 20.331 4.6903 20.333L4.68495 20.3342C4.65333 20.3414 4.57768 20.3587 4.5014 20.3655L4.49776 20.3659C4.44914 20.3706 4.12219 20.4027 3.85975 20.1402C3.5973 19.8778 3.62934 19.5508 3.6341 19.5022L3.63445 19.4986C3.64129 19.4223 3.65853 19.3466 3.66573 19.315L3.66694 19.3097C3.66896 19.3008 3.67101 19.2918 3.67308 19.2827C3.69019 19.2077 3.70903 19.1252 3.72667 19.0061L4.21882 15.6856C4.27564 15.3022 4.45592 14.9479 4.72896 14.6748L15.5035 3.9003ZM16.9412 4.93744C16.8598 4.85603 16.6913 4.83385 16.5641 4.96096L5.78962 15.7355C5.74125 15.7839 5.71164 15.8446 5.70261 15.9055L5.28642 18.7136L8.09449 18.2974C8.15543 18.2883 8.21612 18.2587 8.2645 18.2104L19.039 7.43583C19.1661 7.30872 19.1439 7.14017 19.0625 7.05876L16.9412 4.93744Z"
          fill="#393B46" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M13.7595 5.64453C14.0524 5.35163 14.5273 5.35163 14.8202 5.64453L18.3557 9.18006C18.6486 9.47295 18.6486 9.94783 18.3557 10.2407C18.0628 10.5336 17.5879 10.5336 17.295 10.2407L13.7595 6.70519C13.4666 6.41229 13.4666 5.93742 13.7595 5.64453Z"
          fill="#393B46" />
      </svg>
    </template>
  </DfnColorPicker>

  <h2>SignUpForm</h2>
  <sign-up-form ref="signUpFormRef"></sign-up-form>
  <ElButton @click="handleClickOkButton">OK</ElButton>
  <div>OK 버튼 누르면 결과 나옴: {{ isSuccess }}</div>

  <h2>DfnNumberInput</h2>
  <dfn-number-input
    v-model="myNumber"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur">
  </dfn-number-input>

  <ul>
    <li v-for="item in shallowArr" :key="item">
      {{ item }}
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { ref, shallowRef } from "vue";
  import DfnColorPicker from "@/components/dfn-color-picker/dfn-color-picker.vue";
  import SignUpForm from "@/containers/sign-up-form/sign-up-form.vue";
  import { SignUpFormInstance } from "@/containers/sign-up-form/sign-up-form.d";
  import DfnNumberInput from "@/components/dfn-number-input/dfn-number-input.vue";

  const color = ref<string>("#cccccc");
  const signUpFormRef = ref<SignUpFormInstance | null>(null);
  const isSuccess = ref<boolean>(false);
  const myNumber = ref<number>(0);
  const arr = [1, 2, 3, 4, 5, 6];
  const shallowArr = shallowRef<number[]>(arr);

  setTimeout(() => {
    shallowArr.value = shallowArr.value.slice(1);
  }, 1000);

  function handleClickOkButton() {
    signUpFormRef.value
      ?.submit()
      .then(() => {
        isSuccess.value = true;
      })
      .catch(() => {
        isSuccess.value = false;
      });
  }

  // watchEffect(
  //   () => {
  //     window.console.log("myNumber", myNumber.value);
  //   },
  //   {
  //     onTrack(e) {
  //       window.console.log("watchEffect on track e", e);
  //     },
  //     onTrigger(e) {
  //       window.console.log("watchEffect on trigger e", e);
  //     },
  //   },
  // );
  //
  // const myNumComputed = computed(() => myNumber.value, {
  //   onTrack(e) {
  //     window.console.log("computed on track e", e);
  //   },
  //   onTrigger(e) {
  //     window.console.log("computed on trigger e", e);
  //   },
  // });

  function handleInput(value: number) {
    window.console.log("handleInput", value);
  }

  function handleFocus(e: FocusEvent) {
    window.console.log("handleFocus", e);
  }

  function handleBlur(e: FocusEvent) {
    window.console.log("handleBlur", e);
  }
</script>

<style scoped lang="scss">
  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
  }
</style>
