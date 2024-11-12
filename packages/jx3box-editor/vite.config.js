import { defineConfig } from "vite";
import path from "path";
import { createVuePlugin } from "vite-plugin-vue2";

export default defineConfig({
//   build: {
//     lib: {
//       entry: path.resolve(__dirname, "index.js"),
//       name: "MyLib",
//       fileName: (format) => `my-lib.${format}.js`,
//     },
//     rollupOptions: {
//       // make sure to externalize deps that shouldn't be bundled
//       // into your library
//       external: ["vue"],
//       output: {
//         // Provide global variables to use in the UMD build
//         // for externalized deps
//         globals: {
//           vue: "Vue",
//         },
//       },
//     },
//   },
  plugins: [createVuePlugin()],

  server: {
    proxy: {
      "/api/cms": {
        target:
          process.env.DEV_SERVER === "true"
            ? "http://localhost:5120"
            : "https://cms.jx3box.com",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "");
          });
        },
      },
      "/api/next2": {
        target:
          process.env.DEV_SERVER === "true"
            ? "http://localhost:8000"
            : "https://next2.jx3box.com",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "");
          });
        },
      },
      "/api": {
        target:
          process.env.DEV_SERVER === "true"
            ? "http://localhost:8000"
            : "https://pay.jx3box.com",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "");
          });
        },
      },
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @import "${path.resolve(
            __dirname,
            "./node_modules/csslab/base.less"
          )}";
          @import "${path.resolve(
            __dirname,
            "./node_modules/@jx3box/jx3box-common/css/var.less"
          )}";
        `,
      },
    },
  },

  optimizeDeps: {
    include: ["xss"],
  },
  // Resolve configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".vue", ".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },
});
