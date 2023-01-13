/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 11:17:41
 * @LastEditTime: 2023-01-13 15:30:10
 * @LastEditors: 司马老贼
 */
import { defineComponent  } from 'vue'
// Utils
import { createNamespace } from 'vant/lib/utils';


// Components
import Button from 'vant/lib/button';

// Types
// import { DefaultSlots } from '../../utils/types';
// import Vue, { CreateElement, RenderContext } from 'vue/types';

const [name, bem, t] = createNamespace('sku-actions');




export default defineComponent({
  name,
  props: {
    buyText: String,
    addCartText: String,
    skuEventBus: Object,
    showAddCartBtn: Boolean,
  },
  setup(props) {
    const createEmitter = (name: string) => () => {
      props.skuEventBus.emit(name);
    };
  
    return ()=>  (
      <div class={bem()} >
        {props.showAddCartBtn && (
          <Button
            size="large"
            type="warning"
            text={props.addCartText || '加入购物车'}
            onClick={createEmitter('sku:addCart')}
          />
        )}
        <Button
          size="large"
          type="danger"
          text={props.buyText || '立即购买'}
          onClick={createEmitter('sku:buy')}
        />
      </div>
    );
   
  }
});
