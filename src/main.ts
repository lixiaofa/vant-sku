/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2022-12-20 10:04:21
 * @LastEditTime: 2023-01-06 15:50:49
 * @LastEditors: 司马老贼
 */
import { createApp } from 'vue'



import App from './App.vue'



import './app.less'

// Vant 桌面端适配
import '@vant/touch-emulator'

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import Sku from '@/components/sku'
// import '@/components/sku/index.less';

const app = createApp(App)

app.component(Sku.name , Sku)


app.mount('#app')
