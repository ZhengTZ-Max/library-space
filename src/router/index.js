import { createRouter, createWebHistory } from "vue-router";
// import { setupLayouts } from "virtual:generated-layouts";
import routes from "virtual:generated-pages";
const whitePaths = ["login", "404", "forget"];
// const routesTree = setupLayouts(routes);
console.log(routes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let userToken = sessionStorage.getItem("token");
  
  if (userToken || whitePaths.includes(to.name)) {
    next();
  } else {
    router.replace("login");
  }
});

export default router;
