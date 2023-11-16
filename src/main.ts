import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import "./assets/styles/index.scss";
import { useGridGuide } from "@/composables/use-grid-guide";
import { BUILD_ENV } from "@/const/environment";

if (BUILD_ENV === "development") {
  useGridGuide();
}

const app = createApp(App);
app.config.performance = true;
app.use(store).use(router).use(ElementPlus).mount("#app");
