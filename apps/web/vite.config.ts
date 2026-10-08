import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// base: './' 让构建产物使用相对路径，从而支持直接双击 dist/index.html 以 file:// 打开（双击模式）。
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
