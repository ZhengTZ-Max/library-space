import { createRouter, createWebHashHistory } from "vue-router";
// import { setupLayouts } from "virtual:generated-layouts";
import routes from "virtual:generated-pages";
const whitePaths = ["login", "404", "forget"];
import store from "../store";

// const routesTree = setupLayouts(routes);
console.log(routes);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let userToken = sessionStorage.getItem("token");

  let systemMode = store.state?.systemMode;

  console.log(to);

  if (userToken || whitePaths.includes(to.name)) {
    if (systemMode == "mobile" && (to?.path == "/" || to?.path == "/home")) {
      next("/mo");
    } else {
      next();
    }
  } else {
    router.replace("login");
  }
});

export default router;
