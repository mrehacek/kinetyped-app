import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    alias: "/editor",
    name: "editor",
    component: () => import("./views/EditorView.vue"),
  },
  {
    path: "/type",
    name: "type",
    component: () => import("./views/TypeView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
