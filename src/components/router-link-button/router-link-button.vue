<template>
  <el-button
    :disabled="props.disabled"
    link
    :type="props.type"
    :size="props.size"
    @click="handleButtonClicked">
    <slot />
  </el-button>
</template>

<script setup lang="ts">
  import {
    RouterLinkButtonEmits,
    RouterLinkButtonProps,
  } from "./router-link-button.d";
  import { RouteLocationRaw, useRouter } from "vue-router";

  const props = defineProps<RouterLinkButtonProps>();
  const emits = defineEmits<RouterLinkButtonEmits>();
  const { push, replace } = useRouter();

  function handleButtonClicked() {
    const location: RouteLocationRaw = { name: props.routeName };
    if (props.replace) {
      emits("clicked", replace(location));
    } else {
      emits("clicked", push(location));
    }
  }
</script>

<style scoped lang="scss">
  @import "./router-link-button.scss";
</style>
