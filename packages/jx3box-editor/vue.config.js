import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path';
import { JX3BOX } from "@jx3box/jx3box-common";
import pkg from './package.json';

export default defineConfig({
    plugins: [
        vue()
    ],

    // Define static file paths
    base:
        // FOR Localhost => development
        (process.env.NODE_ENV === 'development' && '/') ||

        // BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||

        // BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||

        // BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||

        // BY OSS => CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||

        // BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||

        // BY root path or bind a domain
        (process.env.STATIC_PATH === 'root' && '/') ||

        // for lost
        '/',

    // Proxy configuration
    server: {
        proxy: {
            '/api/cms': {
                target: process.env['DEV_SERVER'] === 'true' ? 'http://localhost:7100' : 'https://cms.jx3box.com',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('origin', '');
                    });
                },
            },
            '/api/team': {
                target: 'https://team.api.jx3box.com',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('origin', '');
                    });
                },
            },
            '/api': {
                target: 'https://next2.jx3box.com',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('origin', '');
                    });
                },
            },
        }
    },

    // CSS preprocessor options
    css: {
        preprocessorOptions: {
            less: {
                additionalData: `
                    @import "${path.resolve(__dirname, './node_modules/csslab/base.less')}";
                    @import "${path.resolve(__dirname, './node_modules/@jx3box/jx3box-common/css/var.less')}";
                `,
            }
        }
    },

    // Optimize dependencies to include specific modules
    optimizeDeps: {
        include: ['xss']
    },

    // Configure Vite to handle multiple pages
    build: {
        rollupOptions: {
            input: {
                article: path.resolve(__dirname, 'demo/A.js'),
                tinymce: path.resolve(__dirname, 'demo/T.js'),
                markdown: path.resolve(__dirname, 'demo/M.js'),
                article_markdown: path.resolve(__dirname, 'demo/MarkdownArticleDemo.js')
            },
            output: {
                entryFileNames: ({ name }) => `${name}/index.html`
            }
        }
    },

    // Inlining small images and SVGs
    assetsInclude: [
        '**/*.svg',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.gif',
    ],
});