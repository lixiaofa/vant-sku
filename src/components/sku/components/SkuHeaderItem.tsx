/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 11:17:41
 * @LastEditTime: 2023-01-10 20:42:34
 * @LastEditors: 司马老贼
 */

import { defineComponent } from 'vue'
// Utils
import { createNamespace } from 'vant/lib/utils';
// import { inherit } from '../../utils/functional';

// Types
// import { CreateElement, RenderContext } from 'vue/types';
// import { DefaultSlots } from '../../utils/types';

export type SkuHeaderItemProps = {};

const [name, bem] = createNamespace('sku-header-item');



export default defineComponent({
  name,
  setup(props, {slots}) {
  
    return ()=> <div class={bem()}>{slots.default && slots.default()}</div>
  }
})
