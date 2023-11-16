import { ref } from "vue";

const LOCAL_STORAGE_SHOW_GRID_GUIDE_KEY = "show-grid-guide";
const showGridGuideFromLocalStorage =
  localStorage.getItem(LOCAL_STORAGE_SHOW_GRID_GUIDE_KEY) === "true";
const isVisibleGridGuide = ref<boolean>(showGridGuideFromLocalStorage);

function keyDownEventHandler(event: KeyboardEvent): void {
  if (event.ctrlKey && event.shiftKey && event.code === "Digit4") {
    isVisibleGridGuide.value = !isVisibleGridGuide.value;
    localStorage.setItem(
      LOCAL_STORAGE_SHOW_GRID_GUIDE_KEY,
      isVisibleGridGuide.value.toString(),
    );
  }
}

export function useGridGuide() {
  document.addEventListener("keydown", keyDownEventHandler);

  return {
    isVisibleGridGuide,
  };
}
