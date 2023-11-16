import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PlayGround from "../views/PlayGround.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "PlayGroundPage",
    component: PlayGround,
  },
  {
    path: "/test-grid",
    name: "TestGridPage",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "test-grid" */ "../views/TestGrid.vue"),
  },
  {
    path: "/login",
    name: "LoginPage",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "login-page" */ "../views/auth/login/login-page.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
