import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'
import svgLoader from 'vite-svg-loader'

// Load environment variables
const DEV_SERVER = process.env.DEV_SERVER === "true"

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(), // Handles SVG imports
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },

  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @import "${path.resolve(__dirname, './node_modules/csslab/base.less')}";
          @import "${path.resolve(__dirname, './node_modules/@jx3box/jx3box-common/css/var.less')}";
          @import "${path.resolve(__dirname, './src/assets/css/var.less')}";
        `,
      },
    },
  },

  server: {
    proxy: {
      '/api/cms': {
        target: DEV_SERVER ? 'http://localhost:5120' : 'https://cms.jx3box.com',
        changeOrigin: true,
      },
      '/monster': {
        target: DEV_SERVER ? 'http://localhost:5120' : 'https://node.jx3box.com',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://next2.jx3box.com',
        changeOrigin: true,
        headers: {
          origin: ''
        }
      }
    }
  },

  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Inline small images and SVGs (similar to webpack url-loader)
          if (assetInfo.name.endsWith('.png') || 
              assetInfo.name.endsWith('.jpg') || 
              assetInfo.name.endsWith('.jpeg') || 
              assetInfo.name.endsWith('.gif')) {
            // You might want to adjust this size limit (10240 bytes = 10KB)
            if (assetInfo.source.length < 10240) {
              return `assets/inline/[name].[hash][extname]`
            }
          }
          return `assets/[name].[hash][extname]`
        }
      }
    }
  }
})