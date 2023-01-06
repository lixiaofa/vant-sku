/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-04 17:02:03
 * @LastEditTime: 2023-01-05 16:08:38
 * @LastEditors: 司马老贼
 */
// Utils
// import { createNamespace } from '../../utils';
import { createNamespace } from 'vant/lib/utils';
// import { inherit } from '../../utils/functional';


// Types
// import { CreateElement, RenderContext } from 'vue/types';
// import { DefaultSlots } from '../../utils/types';

export type SkuHeaderItemProps = {};

// const [createComponent, bem] = createNamespace('sku-header-item');
const [name , bem] = createNamespace('sku-header-item');



//add
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

// function SkuHeader(
//   h: CreateElement,
//   props: SkuHeaderItemProps,
//   slots: DefaultSlots,
//   ctx: RenderContext<SkuHeaderItemProps>
// ) {
//   return (
//     <div class={bem()} {...inherit(ctx)}>
//       {slots.default && slots.default()}
//     </div>
//   );
// }

// export default createComponent<SkuHeaderItemProps>(SkuHeader);
export default defineComponent({
  // 启用了类型推导
  
  setup(props , {slots}) {
    return (
      <div class={bem()} >
        {slots.default && slots.default()}
      </div>
    );
  }
})
