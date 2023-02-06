/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 10:00:57
 * @LastEditTime: 2023-02-05 11:13:25
 * @LastEditors: 司马老贼
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: ReturnType<typeof defineComponent>
  export default component;
}
