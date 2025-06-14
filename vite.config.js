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
        login: resolve(__dirname, "src/account/login.html"),
        register: resolve(__dirname, "src/account/register.html"),
        appointment: resolve(__dirname, "src/appointment/appoint.html"),
        confirmation: resolve(__dirname, "src/appointment/confirmation.html"),
      },
    },
  },
});
