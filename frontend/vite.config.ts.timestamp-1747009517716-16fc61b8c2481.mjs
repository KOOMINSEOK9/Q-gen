// vite.config.ts
import { defineConfig } from "file:///C:/qgen/6/S12P31B204/frontend/.yarn/__virtual__/vite-virtual-d43b55f9a4/0/cache/vite-npm-5.4.19-6d369030b0-c97601234d.zip/node_modules/vite/dist/node/index.js";
import react from "file:///C:/qgen/6/S12P31B204/frontend/.yarn/__virtual__/@vitejs-plugin-react-virtual-e694b8e06c/0/cache/@vitejs-plugin-react-npm-4.4.1-461fc91f96-0eda45f202.zip/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/qgen/6/S12P31B204/frontend/.yarn/__virtual__/@tailwindcss-vite-virtual-5101c9c057/0/cache/@tailwindcss-vite-npm-4.1.5-9ff932ba56-5888791141.zip/node_modules/@tailwindcss/vite/dist/index.mjs";
import path from "path";
import svgr from "file:///C:/qgen/6/S12P31B204/frontend/.yarn/__virtual__/vite-plugin-svgr-virtual-ae239963a5/0/cache/vite-plugin-svgr-npm-4.3.0-ded8bb690b-a73f10d319.zip/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "C:\\qgen\\6\\S12P31B204\\frontend";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  assetsInclude: ["**/*.svg"],
  // SVG 파일을 에셋으로 처리
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    watch: {
      usePolling: true
    },
    allowedHosts: [
      "q-generator.com",
      "localhost",
      "frontend",
      "frontend_green",
      "frontend_blue"
    ]
  },
  define: {
    global: "window"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxxZ2VuXFxcXDZcXFxcUzEyUDMxQjIwNFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccWdlblxcXFw2XFxcXFMxMlAzMUIyMDRcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3FnZW4vNi9TMTJQMzFCMjA0L2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCksIHN2Z3IoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBhc3NldHNJbmNsdWRlOiBbJyoqLyouc3ZnJ10sIC8vIFNWRyBcdUQzMENcdUM3N0NcdUM3NDQgXHVDNUQwXHVDMTRCXHVDNzNDXHVCODVDIFx1Q0M5OFx1QjlBQ1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIHBvcnQ6IDUxNzMsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgY29yczogdHJ1ZSxcclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHVzZVBvbGxpbmc6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgYWxsb3dlZEhvc3RzOiBbXHJcbiAgICAgICdxLWdlbmVyYXRvci5jb20nLFxyXG4gICAgICAnbG9jYWxob3N0JyxcclxuICAgICAgJ2Zyb250ZW5kJyxcclxuICAgICAgJ2Zyb250ZW5kX2dyZWVuJyxcclxuICAgICAgJ2Zyb250ZW5kX2JsdWUnLFxyXG4gICAgXSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgZ2xvYmFsOiAnd2luZG93JyxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUixTQUFTLG9CQUFvQjtBQUNoVCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVksR0FBRyxLQUFLLENBQUM7QUFBQSxFQUN4QyxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlLENBQUMsVUFBVTtBQUFBO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
