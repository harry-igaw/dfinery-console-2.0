<template>
  <div ref="popperElement" class="dfn-color-picker-popper el-popper">
    <transition name="el-zoom-in-top">
      <div
        v-if="props.visible"
        class="dfn-color-picker-popper__container el-color-picker__panel">
        <div
          ref="pickerElement"
          class="ui-color-picker"
          data-topic="picker"
          data-mode="HSV"></div>
        <div class="dfn-color-picker-popper__button-wrapper">
          <ElButton size="small" @click="handleClickCancelButton">
            취소
          </ElButton>
          <ElButton
            size="small"
            type="primary"
            @click="handleClickConfirmButton">
            확인
          </ElButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import {
    computed,
    inject,
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
  } from "vue";
  import {
    DfnColorPickerPopperEmits,
    DfnColorPickerPopperProps,
  } from "@/components/dfn-color-picker/dfn-color-picker-popper.d";
  import { opacityToHexacode, parseHexacodeToRGBA } from "@/utils/util";
  import UIColorPicker from "@/components/ui-color-picker/ui-color-picker";
  import { UIColorPickerInstance } from "@/components/ui-color-picker/ui-color-picker.d";
  import { createFloatingUIPopper } from "@/helpers/floating-ui-popper-helper";

  const props = defineProps<DfnColorPickerPopperProps>();
  const emits = defineEmits<DfnColorPickerPopperEmits>();

  const popperReferenceElementClassName = inject<string>(
    "dfn-color-picker-popper-reference-class-name",
  );

  const color = ref<string>(props.color);

  const popperElement = ref<HTMLDivElement>();
  let popperReferenceElement: HTMLElement | null = null;
  const pickerElement = ref<HTMLDivElement>();
  let cleanUpPopper: () => void = () => undefined;
  let uiColorPicker: UIColorPickerInstance | null = null;

  const rgbaFromColor = computed(() => {
    return parseHexacodeToRGBA(color.value);
  });

  function closePopper(): void {
    emits("close");
    emits("update:visible", false);
  }

  function handleClickCancelButton(): void {
    closePopper();
  }

  function handleClickConfirmButton(): void {
    if (color.value !== props.color) {
      emits("change", color.value);
    }
    closePopper();
  }

  function setPickerColor(): void {
    if (rgbaFromColor.value) {
      const { r, g, b, a } = rgbaFromColor.value;
      const rgbColor = uiColorPicker.RGBAColor(r, g, b, a);
      rgbColor.format = null;
      uiColorPicker.setColor("picker", rgbColor);
    }
  }

  function handleUpdatePicker(picker: UIColorPickerInstance): void {
    if (props.visible) {
      const { a } = picker;
      color.value = `${picker.getHexa()}${a === 1 ? "" : opacityToHexacode(a)}`;
    }
  }

  function initializeColorPicker(): void {
    uiColorPicker = UIColorPicker();
    uiColorPicker.init(pickerElement.value);
    setPickerColor();
    uiColorPicker.subscribe("picker", handleUpdatePicker);
  }

  async function createPopper(): Promise<void> {
    const { positionReturn, destroy } = await createFloatingUIPopper(
      popperReferenceElement as HTMLElement,
      popperElement.value as HTMLDivElement,
      { placement: "bottom-start" },
    );
    Object.assign(popperElement.value?.style, {
      left: `${positionReturn.x}px`,
      top: `${positionReturn.y}px`,
    });
    cleanUpPopper = () => {
      uiColorPicker.unsubscribe(handleUpdatePicker);
      destroy();
    };
    initializeColorPicker();
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        color.value = props.color;
        createPopper();
      } else {
        if (cleanUpPopper) {
          cleanUpPopper();
        }
      }
    },
  );

  watch(
    () => props.color,
    () => {
      color.value = props.color;
      setPickerColor();
    },
  );

  onMounted(() => {
    popperReferenceElement = document.querySelector(
      popperReferenceElementClassName as string,
    );
    if (popperElement.value) {
      document.body.appendChild(popperElement.value);
    }
  });

  onBeforeUnmount(() => {
    popperElement.value?.remove();
  });
</script>

<style scoped lang="scss">
  @import "dfn-color-picker-popper";
</style>
