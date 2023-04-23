/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 11:17:41
 * @LastEditTime: 2023-03-08 19:41:18
 * @LastEditors: 司马老贼
 */
// , type PropType 
import { defineComponent } from 'vue'
// Utils
import { createNamespace } from 'vant/es/utils';

import { BORDER_BOTTOM } from '../utils/constant';

// Components
import Image from 'vant/es/image';

// Types

// import { SkuData,  SelectedSkuData } from './../types/sku';



type SelectedValueType = {
  ks: string;
  imgUrl: string;
};

const [name, bem] = createNamespace('sku-header');
// sku: SkuData,
// selectedSku: SelectedSkuData
function getSkuImgValue(
  sku: any,
  selectedSku: any
): SelectedValueType | undefined {
  let imgValue;

  sku.tree.some((item) => {
    const id = selectedSku[item.k_s];

    if (id && item.v) {
      const matchedSku =
        item.v.filter((skuValue) => skuValue.id === id)[0] || undefined;

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

// as  PropType<SkuData>
export default defineComponent({
  name,
  // 启用了类型推导
  props:  {
    sku: Object ,
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
        console.log('selectedValue1111' , selectedValue)
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
