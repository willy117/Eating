import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數，允許讀取 VITE_ 開頭以及一般環境變數
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // 設定 base 為 './' 是部署到 GitHub Pages 的關鍵，確保資源路徑正確
    base: './',
    define: {
      // 讓前端程式碼可以使用 process.env.API_KEY
      // 在打包時會將其替換為實際的值
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY),
    },
  };
});