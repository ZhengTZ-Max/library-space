import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";

const Timestamp = new Date().getTime();
// https://vitejs.dev/config/
export default defineConfig({
  base: "/h5",

  plugins: [
    vue(),
    Pages({
      dirs: [
        { dir: "src/pages", baseRoute: "/" },
        { dir: "src/mobile", baseRoute: "/mo" },
      ],
      extendRoute(route) {
        // 默认重定向
        if (route.path === "/:all(.*)*") {
          return {
            ...route,
            redirect: "/home",
          };
        }

        let newRoute = { ...route };

        if (route.path === "/") {
          newRoute = {
            ...route,
            redirect: "/home",
          };
        }

        if (route.path === "/mo") {
          newRoute = {
            ...route,
            redirect: "/mo/home",
          };
        }

        // 确保每个 route 都返回值
        return newRoute;
      },
      importMode: "sync",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // 反向代理
  server: {
    port: 8080,
    // 是否自动在浏览器打开
    open: false,
    // 是否开启 https
    https: false,
    proxy: {
      "/api": {
        target: "http://kfcs3.skalibrary.com/",
        // target: "https://sh.swechat.cc/",
        // target:"http://192.168.121.111/",

        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].${Timestamp}.js`,
        chunkFileNames: `assets/[name].${Timestamp}.js`,
        assetFileNames: `assets/[name].${Timestamp}.[ext]`,
      },
    },
    // minify: "terser",
    // terserOptions: {
    //   compress: {
    //     //生产环境时移除console
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
  },
});
