import path from 'path'


import { loadEnv   } from 'vite'

import type { ConfigEnv, UserConfig } from 'vite'

import { visualizer } from 'rollup-plugin-visualizer'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'


import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'

import px2vw from '@yuo/postcss-px2vw'
import autoprefixer from 'autoprefixer'



export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  return {
    base: env.VITE_APP_PUBLIC_PATH,

    define: {
      'process.env.VUE_APP_API_BASE_URL': JSON.stringify(env.VITE_APP_API_BASE_URL),
      'process.env.VUE_APP_PUBLIC_PATH': JSON.stringify(env.VITE_APP_PUBLIC_PATH),
    },

    plugins: [
      vue(),
      vueJsx(),
      visualizer(),

      Components({
        resolvers: [VantResolver()],
      }),
    
     
      AutoImport({
        include: [
          /\.[tj]sx?$/,
          /\.vue$/,
          /\.vue\?vue/,
        ],
        imports: [
          'vue',
        
         
        ],
        dts: true,
      }),


    

    
    ],

    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          px2vw({
            viewportWidth: 375,
          }),
        ],
      },
    },

    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
     
      lib: {
        
        // Could also be a dictionary or array of multiple entry points
        entry: path.resolve(__dirname, 'src/components/sku/index.ts'),
        name: 'vant-sku',
        // the proper extensions will be added
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => `vant-sku.${format}.js`,
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue' , 'vant'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          assetFileNames: 'index.[ext]',
          globals: {
            vue: 'Vue',
            vant: 'vant'
          },
        },
      },
    },

    resolve: {
      alias: {
       
   
        
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
      },
    },

    server: {
      host: true,
      port: 3000,
      proxy: env.VITE_HTTP_MOCK === 'true'
        ? undefined
        : {
            '/api': {
              target: '',
              ws: false,
              changeOrigin: true,
            },
          },
    },
  }
}
