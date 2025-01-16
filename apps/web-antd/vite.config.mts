/*
 * @Author: cwx
 * @Date: 2024-12-17 21:39:49
 * @LastEditTime: 2024-12-19 21:02:45
 * @LastEditors: cwx
 * @Description:
 */
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        // proxy: {
        //   '/api': {
        //     changeOrigin: true,
        //     rewrite: (path) => path.replace(/^\/api/, ''),
        //     // mock代理目标地址
        //     target: 'http://localhost:5320/api',
        //     ws: true,
        //   },
        // },
      },
    },
  };
});
