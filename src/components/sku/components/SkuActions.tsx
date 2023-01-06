/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-04 17:02:03
 * @LastEditTime: 2023-01-05 17:06:11
 * @LastEditors: 司马老贼
 */


// Utils
// import { createNamespace } from '../../utils';
import { createNamespace } from 'vant/lib/utils';
// import { inherit } from '../../utils/functional';


// Components
// import Button from '../../button';
import Button from 'vant/lib/button';

// Types
// import { DefaultSlots } from '../../utils/types';
// import Vue, { CreateElement, RenderContext } from 'vue/types';

//add
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

// export type SkuActionsProps = {
//   buyText?: string;
//   skuEventBus: Vue;
//   addCartText?: string;
//   showAddCartBtn?: boolean;
// };

// const [createComponent, bem, t] = createNamespace('sku-actions');
const [name ,  bem, t] = createNamespace('sku-actions');

// function SkuActions(
//   h: CreateElement,
//   props: SkuActionsProps,
//   slots: DefaultSlots,
//   ctx: RenderContext<SkuActionsProps>
// ) {
//   const createEmitter = (name: string) => () => {
//     props.skuEventBus.$emit(name);
//   };

//   return (
//     <div class={bem()} {...inherit(ctx)}>
//       {props.showAddCartBtn && (
//         <Button
//           size="large"
//           type="warning"
//           text={props.addCartText || t('addCart')}
//           onClick={createEmitter('sku:addCart')}
//         />
//       )}
//       <Button
//         size="large"
//         type="danger"
//         text={props.buyText || t('buy')}
//         onClick={createEmitter('sku:buy')}
//       />
//     </div>
//   );
// }

// SkuActions.props = {
//   buyText: String,
//   addCartText: String,
//   skuEventBus: Object,
//   showAddCartBtn: Boolean,
// };

// export default createComponent<SkuActionsProps>(SkuActions);
export default defineComponent({
  name,
  // 启用了类型推导
  props:  {
      buyText: String,
      addCartText: String,
      skuEventBus: Object,
      showAddCartBtn: Boolean,
    },
  setup(props) {
      const createEmitter = (name: string) => () => {
    props.skuEventBus.$emit(name);
  };

  return (
    <div class={bem()} >
      {props.showAddCartBtn && (
        <Button
          size="large"
          type="warning"
          text={props.addCartText || t('addCart')}
          onClick={createEmitter('sku:addCart')}
        />
      )}
      <Button
        size="large"
        type="danger"
        text={props.buyText || t('buy')}
        onClick={createEmitter('sku:buy')}
      />
    </div>
  );
   
  }
})
 