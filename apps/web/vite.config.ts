import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// base: './' + viteSingleFile：把 JS/CSS 全部内联进 index.html，
// 从而支持直接双击 dist/index.html 以 file:// 打开（Chrome 会拦截 file:// 的外部 module 脚本）。
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
});
