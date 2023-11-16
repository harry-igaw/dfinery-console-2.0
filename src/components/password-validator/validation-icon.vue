<template>
  <span :class="['validation-icon', { 'is-valid': props.isValid }]"></span>
</template>

<script setup lang="ts">
  import { ValidationIconProps } from "@/components/password-validator/password-validator";

  const props = defineProps<ValidationIconProps>();
</script>

<style scoped lang="scss">
  @import "validation-icon";
</style>
