<template>
  <RouterLink to="/">PlayGround</RouterLink>
  <RouterLink to="test-grid">Test Grid</RouterLink>
  <RouterLink to="login">Login</RouterLink>
  <router-view />
  <GridGuide :visible="isDevelopment && isVisibleGridGuide"></GridGuide>
</template>

<script setup lang="ts">
  import GridGuide from "@/components/grid-guide/grid-guide.vue";
  import { useGridGuide } from "@/composables/use-grid-guide";
  import { BUILD_ENV } from "@/const/environment";

  const isDevelopment = BUILD_ENV === "development";
  const { isVisibleGridGuide } = useGridGuide();
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    position: relative;
  }
  a {
    margin: 20px;
  }
</style>
