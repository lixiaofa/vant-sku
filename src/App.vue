<!--
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2022-12-20 10:04:21
 * @LastEditTime: 2023-01-13 19:39:18
 * @LastEditors: 司马老贼
-->

<script lang="ts">
import Sku from '@/components/sku'
import TestStepper from '@/components/test-stepper'



import { getSkuData } from './data';
import { LIMIT_TYPE } from './constants';

export default ({
  i18n: {
    'zh-CN': {
      button1: '积分兑换',
      button2: '买买买',
      actionsTop: '商品不多，赶快购买吧',
      stepperTitle: '我要买',
      customBySlot: '通过插槽定制',
      customStepper: '自定义步进器',
      hideSoldoutSku: '隐藏售罄规格',
      largeImageMode: '大图预览模式',
    },
    'en-US': {
      button1: 'Button',
      button2: 'Button',
      actionsTop: 'Action top info',
      customBySlot: 'Custom By Slot',
      stepperTitle: 'Stepper title',
      customStepper: 'Custom Stepper',
      hideSoldoutSku: 'Hide Soldout Sku',
      largeImageMode: 'Large Image Mode',
    },
  },
  components: {
    Sku,
    TestStepper
  },
  data() {
    //  this.skuData = getSkuData();


    return {
      value: 2,
      skuData: getSkuData(),
      showBase: false,
      showCustom: false,
      showStepper: false,
      showSoldout: false,
      showLargePicturePreview: false,
      customSkuValidator: () => '请选择xxx',
      customStepperConfig: {
        quotaText: '单次限购100件',
        stockFormatter: (stock) => `剩余${stock}`,
        handleOverLimit: (data) => {
          const { action, limitType, quota, startSaleNum = 1 } = data;

          if (action === 'minus') {
            this.$toast(
              startSaleNum > 1 ? `${startSaleNum}件起售` : '至少选择一件商品'
            );
          } else if (action === 'plus') {
            if (limitType === LIMIT_TYPE.QUOTA_LIMIT) {
              this.$toast(`限购${quota}件`);
            } else {
              this.$toast('库存不够了');
            }
          }
        },
      },
      messageConfig: {
        initialMessages: {
          留言1: '商品留言',
        },
        uploadImg: (file, img) =>
          new Promise((resolve) => {
            setTimeout(() => resolve(img), 1000);
          }),
        uploadMaxSize: 3,
      },
    };
  },

  

  methods: {
    onBuyClicked(data) {
      this.$toast('buy:' + JSON.stringify(data));
    },

    onAddCartClicked(data) {
      this.$toast('add cart:' + JSON.stringify(data));
    },

    onPointClicked() {
      this.$toast('积分兑换');
    },
  },
});
</script>

<template>
  <div class="app">

    <div class="sku-container">
     
      <Sku  v-model="showBase" :sku="skuData.sku" :quota="skuData.quota" :goods="skuData.goods_info"
        :goods-id="skuData.goods_id" :quota-used="skuData.quota_used" :properties="skuData.properties"
        :hide-stock="skuData.sku.hide_stock" :message-config="messageConfig" :start-sale-num="skuData.start_sale_num"
        :custom-sku-validator="customSkuValidator" disable-stepper-input reset-stepper-on-hide safe-area-inset-bottom
        reset-selected-sku-on-hide @buy-clicked="onBuyClicked" @add-cart="onAddCartClicked" />
      <van-button block type="primary" @click="showBase = true">
        basicUsage
      </van-button>
    </div>
    <!-- <van-stepper v-model="value" /> -->
    <TestStepper />
  
   



  </div>
</template>
