import { appendFile } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        doctor: resolve(__dirname, "src/doctor/index.html"),
        account: resolve(__dirname, "src/account/index.html"),
        appointment: resolve(__dirname, "src/appointment/index.html"),
      },
    },
  },
});
