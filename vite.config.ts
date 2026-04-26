// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@components": path.resolve(__dirname, "./src/components"),
//       "@features": path.resolve(__dirname, "./src/features"),
//       "@lib": path.resolve(__dirname, "./src/lib"),
//       "@store": path.resolve(__dirname, "./src/store"),
//       "@utils": path.resolve(__dirname, "./src/utils"),
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ ADD THIS

      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },

  // ✅ ALSO ADD THIS (fix devtools issue)
  optimizeDeps: {
    include: ["@tanstack/react-query-devtools"],
  },
});