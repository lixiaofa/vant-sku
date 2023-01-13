/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 11:17:41
 * @LastEditTime: 2023-01-12 11:10:29
 * @LastEditors: 司马老贼
 */
import { defineComponent , type PropType } from 'vue'
// Utils
import { createNamespace } from 'vant/lib/utils';
// import { inherit } from '../../utils/functional';
import { BORDER_BOTTOM } from '@/utils/constant';

// Components
import Image from 'vant/lib/image';

// Types
// import Vue, { CreateElement, RenderContext } from 'vue/types';
// import { DefaultSlots, ScopedSlot } from '../../utils/types';
import { SkuData, SkuGoodsData, SelectedSkuData } from '../../../../types/sku';



type SelectedValueType = {
  ks: string;
  imgUrl: string;
};

const [name, bem] = createNamespace('sku-header');

function getSkuImgValue(
  sku: SkuData,
  selectedSku: SelectedSkuData
): SelectedValueType | undefined {
  let imgValue;

  sku.tree.some((item) => {
    const id = selectedSku[item.k_s];

    if (id && item.v) {
      const matchedSku =
        item.v.filter((skuValue) => skuValue.id === id)[0] || {};

      const img =
        matchedSku.previewImgUrl || matchedSku.imgUrl || matchedSku.img_url;
      if (img) {
        imgValue = {
          ...matchedSku,
          ks: item.k_s,
          imgUrl: img,
        };
        return true;
      }
    }

    return false;
  });

  return imgValue;
}


export default defineComponent({
  name,
  // 启用了类型推导
  props:  {
    sku: Object as  PropType<SkuData>,
    goods: Object,
    skuEventBus: Object,
    selectedSku: Object,
    showHeaderImage: Boolean,
  },
  setup(props , {slots}) {
    return ()=>{
      const {
        sku,
        goods,
        skuEventBus,
        selectedSku,
        showHeaderImage = true,
      } = props;
  
      const selectedValue = getSkuImgValue(sku, selectedSku);
      const imgUrl = selectedValue ? selectedValue.imgUrl : goods.picture;
    
  
      const previewImage = () => {
        skuEventBus.emit('sku:previewImage', selectedValue);
      };
      
      return (
        <div class={[bem(), BORDER_BOTTOM]}>
         
          {showHeaderImage && (
            <Image
              fit="cover"
              src={imgUrl}
              class={bem('img-wrap')}
              onClick={previewImage}
            >
              {slots['sku-header-image-extra']?.()}
            </Image>
          )}
          <div class={bem('goods-info')}>{slots.default?.()}</div>
        </div>
      );
    }
    
  }
})
