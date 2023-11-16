<template>
  <button
    ref="dfnColorPickerButtonElement"
    :class="['dfn-color-picker', { 'is-disabled': props.disabled }]"
    type="button"
    :disabled="props.disabled"
    @click.stop="handleClickColorPickerButton">
    <template v-if="!$slots.default">
      <slot name="icon"></slot>
      <div class="dfn-color-picker__current-color-wrapper">
        <div
          class="dfn-color-picker__current-color"
          :style="{ backgroundColor: color }"></div>
      </div>
    </template>
    <slot></slot>
    <DfnColorPickerPopper
      :color="color"
      v-model:visible="visiblePopper"
      @change="handleChangeColor">
    </DfnColorPickerPopper>
  </button>
</template>

<script setup lang="ts">
  import DfnColorPickerPopper from "@/components/dfn-color-picker/dfn-color-picker-popper.vue";
  import { ref, provide } from "vue";
  import {
    DfnColorPickerEmits,
    DfnColorPickerProps,
  } from "@/components/dfn-color-picker/dfn-color-picker.d";

  const props = defineProps<DfnColorPickerProps>();
  const emits = defineEmits<DfnColorPickerEmits>();

  provide("dfn-color-picker-popper-reference-class-name", ".dfn-color-picker");

  const visiblePopper = ref<boolean>(false);

  function handleClickColorPickerButton() {
    visiblePopper.value = true;
  }

  function handleChangeColor(color: string) {
    emits("update:color", color);
  }
</script>

<style scoped lang="scss">
  @import "dfn-color-picker";
</style>
