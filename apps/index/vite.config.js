import path from 'path';
import { defineConfig } from 'vite';
import { JX3BOX } from '@jx3box/jx3box-common';
import Setting from './setting.json';
import pkg from './package.json';
import { createVuePlugin } from 'vite-plugin-vue2';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import { resolve } from 'path';
function joinPath(dir) {
  return path.join(__dirname, dir);
}
const pages = {
  index: {
    title: 'Võ lâm 3D' + Setting.suffix,
    entry: 'src/main.js',
    template: 'public/index.html',
    filename: 'login.html',
  },
  notice: {
    title: 'Thông báo và Tin tức' + Setting.suffix,
    entry: 'src/pages/notice.js',
    template: 'public/index.html',
    filename: 'notice/index.html',
  },
  tv: {
    title: 'TV' + Setting.suffix,
    entry: 'src/pages/tv.js',
    template: 'public/index.html',
    filename: 'tv/index.html',
  },
  about: {
    title: 'Về chúng tôi' + Setting.suffix,
    entry: 'src/pages/about.js',
    template: 'public/index.html',
    filename: 'about/index.html',
  },
  post: {
    title: 'Tác phẩm' + Setting.suffix,
    entry: 'src/pages/post.js',
    template: 'public/index.html',
    filename: 'post/index.html',
  },
};

const rimraf = (dir_path) => {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function (entry) {
      var entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
};

const publicPath = () => {
  return (
    (process.env.NODE_ENV === 'development' && '/') ||
    (process.env.STATIC_PATH === 'origin' &&
      `${JX3BOX.__staticPath['origin']}${pkg.name}/`) ||
    (process.env.STATIC_PATH === 'github' &&
      `${JX3BOX.__staticPath['github']}${pkg.name}/`) ||
    (process.env.STATIC_PATH === 'jsdelivr' &&
      `${JX3BOX.__staticPath['jsdelivr']}${pkg.name}@gh-pages/`) ||
    (process.env.STATIC_PATH === 'mirror' &&
      `${JX3BOX.__staticPath['mirror']}${pkg.name}/`) ||
    (process.env.STATIC_PATH === 'repo' && `/${pkg.name}/`) ||
    (process.env.STATIC_PATH == 'root' && '/') ||
    '/'
  );
};

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, `../../../dist/${pkg.name}`);
export default defineConfig({
  base: publicPath(),
  root: root,
  publicDir: 'public',
  build: {
    cssMinify: false, // TODO: [WARNING] Expected identifier but found "*" [css-syntax-error]
    outDir: outDir,
    emptyOutDir: true,
    assetsDir: 'js',
    rollupOptions: {
      input: {
        index: resolve(root, './templates/index.html'),
        about: resolve(root, './templates/about/index.html'),
        notice: resolve(root, './templates/notice/index.html'),
        post: resolve(root, './templates/post/index.html'),
        tv: resolve(root, './templates/tv/index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
        assetFileNames: (assetInfo) => {
          const basePaths = {
            '.css': 'css',
            '.js': 'js',
            '.ttf': 'fonts',
            '.woff': 'fonts',
            '.woff2': 'fonts',
            '.png': 'img',
            '.jpg': 'img',
            '.gif': 'img',
            '.svg': 'img',
          };
          const ext = Object.keys(basePaths).find((ext) =>
            assetInfo.name.endsWith(ext)
          );
          return ext
            ? `${basePaths[ext]}/[name].[hash][extname]`
            : '[name].[hash][extname]';
        },
      },
    },
  },

  // Plugins
  plugins: [
    createVuePlugin(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, './public') + '/[!.]*', // 1️⃣
          dest: './', // 2️⃣
        },
      ],
    }),
    {
      name: 'svg-url-replace',
      transform(code, id) {
        if (id.endsWith('.svg')) {
          // Replace `@url` in the src path
          if (code.includes('@url')) {
            // Vite will handle SVG as a URL
            const url = id.replace('@', '/src');
            return code.replace('@url', url);
          }
        }
        return code;
      },
    },
    {
      // Note that for HTML files, Vite ignores the name given to the entry in the rollupOptions.input object and
      // instead respects the resolved id of the file when generating the HTML asset in the dist folder.
      // This ensures a consistent structure with the way the dev server works.
      name: 'change-html-path',
      enforce: 'post',
      generateBundle(_, bundle) {
        const htmlFileInSrcFolderPattern = /^templates\/.*\.html$/;
        for (const outputItem of Object.values(bundle)) {
          if (!htmlFileInSrcFolderPattern.test(outputItem.fileName)) {
            continue;
          }
          outputItem.fileName = outputItem.fileName.replace('templates/', '');
        }
      },
    },
  ],
  server: {
    proxy: {
      '/api/vip': {
        target: 'https://pay.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vip/, ''),
      },
      '/api/event': {
        target: 'https://pay.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/event/, ''),
      },
      '/api/inspire': {
        target: 'https://pay.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/inspire/, ''),
      },
      '/api/messages': {
        target: 'https://helper.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/messages/, ''),
      },
      '/api/summary': {
        target: 'https://next2.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/summary/, ''),
      },
      '/api/comment': {
        target: 'https://next2.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/comment/, ''),
      },
      '/api/team': {
        target: 'https://team.api.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/team/, ''),
      },
      '/xoyo/daily': {
        target: 'https://team.api.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xoyo\/daily/, ''),
      },
      '/api/cms': {
        target:
          process.env['DEV_SERVER'] == 'true'
            ? 'http://localhost:7100'
            : 'https://cms.jx3box.com',
        changeOrigin: true,
      },
      '/api/next2': {
        target: 'https://next2.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/, ''),
      },
      '/api/game/reporter/horse': {
        target: 'https://next2.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/, ''),
      },
      '/api/joke/recommended': {
        target: 'https://next2.jx3box.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/, ''),
      },
    },
    disableHostCheck: true,
  },

  resolve: {
    alias: {
      '@/': joinPath('src/'),
      '~@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.vue', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },

  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
                    @import "${path.resolve(
                      __dirname,
                      './node_modules/csslab/base.less'
                    )}";
                    @import "${path.resolve(
                      __dirname,
                      './node_modules/@jx3box/jx3box-common/css/var.less'
                    )}";
                    @import "${path.resolve(
                      __dirname,
                      './src/assets/css/var.less'
                    )}";
                `,
      },
    },
  },
});
