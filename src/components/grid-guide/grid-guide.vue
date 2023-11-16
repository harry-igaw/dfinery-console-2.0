<template>
  <div v-show="props.visible" class="grid-guide grid-row">
    <template v-for="i in 12" :key="i">
      <div class="grid-guide__col"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { GridGuideProps } from "./grid-guide.d";

  const props = defineProps<GridGuideProps>();
</script>

<style scoped lang="scss">
  @import "./grid-guide.scss";
</style>
