<!--
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 10:00:57
 * @LastEditTime: 2023-02-06 10:02:46
 * @LastEditors: 司马老贼
-->
<template>

  <div class="demo">
    
    <van-sku
          v-model="showBase"
          :sku="skuData.sku"
          :quota="skuData.quota"
          :goods="skuData.goods_info"
          :goods-id="skuData.goods_id"
          :quota-used="skuData.quota_used"
          :properties="skuData.properties"
          :hide-stock="skuData.sku.hide_stock"
          :start-sale-num="skuData.start_sale_num"
          :custom-sku-validator="customSkuValidator"
          disable-stepper-input
          reset-stepper-on-hide
          safe-area-inset-bottom
          reset-selected-sku-on-hide
          @buy-clicked="onBuyClicked"
          @add-cart="onAddCartClicked"
        />
        <van-button block type="primary" @click="showBase = true">
          basicUsage
        </van-button>
  </div>
 
</template>

<script setup lang="ts">
import { ref , reactive} from 'vue';
import { showToast } from 'vant';
import 'vant/es/toast/style';
import VanSku from '../dist/vant-sku.es'




import { initialSku, getSkuData } from './data';
import { LIMIT_TYPE } from './constants';  



const skuData = ref(getSkuData())
const skuData2 = ref(getSkuData(true))
// const initialSku = ref(initialSku)
const showBase = ref(false)
const showCustom = ref(false)
const showStepper = ref(false)
const showSoldout = ref(false)
const showLargePicturePreview = ref(false)
const customSkuValidator = () => '请选择xxx'
const customStepperConfig = reactive(
  {
        quotaText: '单次限购100件',
        stockFormatter: (stock) => `剩余${stock}`,
        handleOverLimit: (data) => {
          const { action, limitType, quota, startSaleNum = 1 } = data;

          if (action === 'minus') {
            showToast(
              startSaleNum > 1 ? `${startSaleNum}件起售` : '至少选择一件商品'
            );
          } else if (action === 'plus') {
            if (limitType === LIMIT_TYPE.QUOTA_LIMIT) {
              showToast(`限购${quota}件`);
            } else {
              showToast('库存不够了');
            }
          }
        },
      }
)
const  onBuyClicked = (data)=> {  showToast('buy:' + JSON.stringify(data))}
const  onAddCartClicked = (data)=> {  showToast('add cart:' + JSON.stringify(data))}
const  onPointClicked = (data)=> {  showToast('积分兑换')}


</script>


<style lang="less">

</style>