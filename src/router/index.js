import { createRouter, createWebHistory } from "vue-router";
// import { setupLayouts } from "virtual:generated-layouts";
import routes from "virtual:generated-pages";

// const routesTree = setupLayouts(routes);
console.log(routes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
