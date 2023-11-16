<template>
  <div class="login-page">
    <div class="grid-row">
      <div class="col-start-4 col-6">
        <div class="login-container">
          <img
            class="login-page__logo-image"
            src="@assets/images/dfinery-logo-with-text.svg"
            alt="Dfinery" />

          <LoginForm :disabled="false" />

          <ElButton
            class="is-full login-page__login-button"
            type="primary"
            size="large"
            @click="handleLoginButtonClicked">
            로그인
          </ElButton>
          <div>
            <span>아직 디파이너리 회원이 아니신가요?</span>
            <router-link-button
              route-name="PlayGroundPage"
              type="primary"
              size="large">
              회원가입
            </router-link-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoginForm from "@/containers/login-form/login-form.vue";
  import RouterLinkButton from "@/components/router-link-button/router-link-button.vue";

  function handleLoginButtonClicked() {
    window.console.log("login button clicked");
  }
</script>

<style scoped lang="scss">
  @import "login-page";
</style>
