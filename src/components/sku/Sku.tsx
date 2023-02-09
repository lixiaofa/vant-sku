import { defineComponent } from 'vue'
import {createNamespace} from 'vant/es/utils'
// const Emitter = require('tiny-emitter');
import emitter from 'tiny-emitter/instance'

import Popup from 'vant/es/popup';
import {showToast}  from "vant/es/toast";
import {showImagePreview } from 'vant/es/image-preview';
import SkuHeader from '@/components/sku/components/SkuHeader';
import SkuHeaderItem from './components/SkuHeaderItem';
import SkuRow from './components/SkuRow';
import SkuRowItem from './components/SkuRowItem';
import SkuRowPropItem from './components/SkuRowPropItem';
import SkuStepper from './components/SkuStepper';

import SkuActions from './components/SkuActions';
import {  isEmpty } from './utils';



import {
  isAllSelected,
  isSkuChoosable,
  getSkuComb,
  getSelectedSkuValues,
  getSelectedPropValues,
  getSelectedProperties,
} from './utils/sku-helper';
import { LIMIT_TYPE, UNSELECTED_SKU_VALUE_ID } from './constants';





const namespace = createNamespace('sku');
const [name, bem, t] = namespace;
const { QUOTA_LIMIT } = LIMIT_TYPE;



export default defineComponent({
  name,
  props: {
    sku: Object,
    goods: Object,
    modelValue: Boolean,
    buyText: String,
    goodsId: [Number, String],
    priceTag: String,
    lazyLoad: Boolean,
    hideStock: Boolean,
    properties: Array,
    addCartText: String,
    stepperTitle: String,
    getContainer: [String, Function],
    hideQuotaText: Boolean,
    hideSelectedText: Boolean,
    resetStepperOnHide: Boolean,
    customSkuValidator: Function,
    disableStepperInput: Boolean,
    resetSelectedSkuOnHide: Boolean,
    quota: {
      type: Number,
      default: 0,
    },
    quotaUsed: {
      type: Number,
      default: 0,
    },
    startSaleNum: {
      type: Number,
      default: 1,
    },
    initialSku: {
      type: Object,
      default: () => ({}),
    },
    stockThreshold: {
      type: Number,
      default: 50,
    },
    showSoldoutSku: {
      type: Boolean,
      default: true,
    },
    showAddCartBtn: {
      type: Boolean,
      default: true,
    },
    disableSoldoutSku: {
      type: Boolean,
      default: true,
    },
    customStepperConfig: {
      type: Object,
      default: () => ({}),
    },
    showHeaderImage: {
      type: Boolean,
      default: true,
    },
    previewOnClickImage: {
      type: Boolean,
      default: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
    bodyOffsetTop: {
      type: Number,
      default: 200,
    },
    messageConfig: {
      type: Object,
      default: () => ({
        initialMessages: {},
        placeholderMap: {},
        uploadImg: () => Promise.resolve(),
        uploadMaxSize: 5,
      }),
    },
  },
  emits: [
           'sku-prop-selected',
           'after-sku-create',
           'update:modelValue' , 
           'input' , 
           'sku-close' , 
           'sku-selected' , 
           'sku-reset'
          ],


  data() {
  
   
    return {
      selectedSku: {},
      selectedProp: {},
      selectedNum: 1,
      show: this.modelValue,
      skuRows: []
     
    };
  },

  watch: {
    show(val) {
      
      
      
      this.$emit('update:modelValue', val);

      if (!val) {
        this.$emit('sku-close', {
          selectedSkuValues: this.selectedSkuValues,
          selectedNum: this.selectedNum,
          selectedSkuComb: this.selectedSkuComb,
        });

        if (this.resetStepperOnHide) {
          this.resetStepper();
        }

        if (this.resetSelectedSkuOnHide) {
          this.resetSelectedSku();
        }
      }
    },

    modelValue(val) {
    
      this.show = val;
    },

    skuTree: 'resetSelectedSku',

    initialSku() {
      this.resetStepper();
      this.resetSelectedSku();
    },
  },

  computed: {
  
    skuGroupClass() {
      return [
        'van-sku-group-container',
        {
          'van-sku-group-container--hide-soldout': !this.showSoldoutSku,
        },
      ];
    },

    bodyStyle() {
      
      const maxHeight = window.innerHeight - this.bodyOffsetTop;

      return {
        maxHeight: maxHeight + 'px',
      };
    },

    isSkuCombSelected() {
      // SKU 未选完
      if (this.hasSku && !isAllSelected(this.skuTree, this.selectedSku)) {
        return false;
      }

      // 属性未全选
      return !this.propList
        .filter((i) => i.is_necessary !== false)
        .some((i) => (this.selectedProp[i.k_id] || []).length === 0);
    },

    isSkuEmpty() {
      return Object.keys(this.sku).length === 0;
    },

    hasSku() {
      return !this.sku.none_sku;
    },

    hasSkuOrAttr() {
      return this.hasSku || this.propList.length > 0;
    },

    selectedSkuComb() {
      let skuComb = null;
      if (this.isSkuCombSelected) {
        if (this.hasSku) {
          skuComb = getSkuComb(this.skuList, this.selectedSku);
        } else {
          skuComb = {
            id: this.sku.collection_id,
            price: Math.round(this.sku.price * 100),
            stock_num: this.sku.stock_num,
          };
        }

        if (skuComb) {
          skuComb.properties = getSelectedProperties(
            this.propList,
            this.selectedProp
          );
          skuComb.property_price = this.selectedPropValues.reduce(
            (acc, cur) => acc + (cur.price || 0),
            0
          );
        }
      }
      return skuComb;
    },

    selectedSkuValues() {
      return getSelectedSkuValues(this.skuTree, this.selectedSku);
    },

    selectedPropValues() {
      return getSelectedPropValues(this.propList, this.selectedProp);
    },

    price() {
      if (this.selectedSkuComb) {
        return (
          (this.selectedSkuComb.price + this.selectedSkuComb.property_price) /
          100
        ).toFixed(2);
      }
      // sku.price是一个格式化好的价格区间
      return this.sku.price;
    },

    originPrice() {
      if (this.selectedSkuComb && this.selectedSkuComb.origin_price) {
        return (
          (this.selectedSkuComb.origin_price +
            this.selectedSkuComb.property_price) /
          100
        ).toFixed(2);
      }
      return this.sku.origin_price;
    },

    skuTree() {
      return this.sku.tree || [];
    },

    skuList() {
      return this.sku.list || [];
    },

    propList() {
      return this.properties || [];
    },

    imageList() {
      const imageList = [this.goods.picture];

      if (this.skuTree.length > 0) {
        this.skuTree.forEach((treeItem) => {
          if (!treeItem.v) {
            return;
          }

          treeItem.v.forEach((vItem) => {
            const imgUrl = vItem.previewImgUrl || vItem.imgUrl || vItem.img_url;

            if (imgUrl && imageList.indexOf(imgUrl) === -1) {
              imageList.push(imgUrl);
            }
          });
        });
      }

      return imageList;
    },

    stock() {
      const { stockNum } = this.customStepperConfig;
      if (stockNum !== undefined) {
        return stockNum;
      }
      if (this.selectedSkuComb) {
        return this.selectedSkuComb.stock_num;
      }
      return this.sku.stock_num;
    },

    stockText() {
      const { stockFormatter } = this.customStepperConfig;
      if (stockFormatter) {
        return stockFormatter(this.stock);
      }

      return [
        `剩余`,
        <span
          class={bem('stock-num', {
            highlight: this.stock < this.stockThreshold,
          })}
        >
          {this.stock}
        </span>,
        `件`,
      ];
    },

    selectedText() {
    
      if (this.selectedSkuComb) {
        const values = this.selectedSkuValues.concat(this.selectedPropValues);
        return `已选择 ${values.map((item) => item.name).join(' ')}`;
      }

      const unselectedSku = this.skuTree
        .filter(
          (item) => this.selectedSku[item.k_s] === UNSELECTED_SKU_VALUE_ID
        )
        .map((item) => item.k);

      const unselectedProp = this.propList
        .filter((item) => (this.selectedProp[item.k_id] || []).length < 1)
        .map((item) => item.k);

      return `请选择 ${unselectedSku.concat(unselectedProp).join(' ')}`;
    },
  },

  created() {
  
    

    const skuEventBus = emitter ;
    this.skuEventBus = skuEventBus;

    skuEventBus.on('sku:select', this.onSelect);
    skuEventBus.on('sku:propSelect', this.onPropSelect);
    skuEventBus.on('sku:numChange', this.onNumChange);
    skuEventBus.on('sku:previewImage', this.onPreviewImage);
    skuEventBus.on('sku:overLimit', this.onOverLimit);
    skuEventBus.on('sku:stepperState', this.onStepperState);
    skuEventBus.on('sku:addCart', this.onAddCart);
    skuEventBus.on('sku:buy', this.onBuy);

    this.resetStepper();
    this.resetSelectedSku();

    // 组件初始化后的钩子，抛出skuEventBus
    this.$emit('after-sku-create', skuEventBus);
  },

  methods: {
    resetStepper() {
      const { skuStepper } = this.$refs;
      const { selectedNum } = this.initialSku;
      const num = selectedNum ?? this.startSaleNum;
      // 用来缓存不合法的情况
      this.stepperError = null;

      if (skuStepper) {
        skuStepper.setCurrentNum(num);
      } else {
        // 当首次加载（skuStepper 为空）时，传入数量如果不合法，可能会存在问题
        this.selectedNum = num;
      }
    },

    // @exposed-api
    resetSelectedSku() {
      this.selectedSku = {};

      // 重置 selectedSku
      this.skuTree.forEach((item) => {
        this.selectedSku[item.k_s] = UNSELECTED_SKU_VALUE_ID;
      });
      this.skuTree.forEach((item) => {
        const key = item.k_s;
        // 规格值只有1个时，优先判断
        const valueId =
          item.v.length === 1 ? item.v[0].id : this.initialSku[key];
        if (
          valueId &&
          isSkuChoosable(this.skuList, this.selectedSku, { key, valueId })
        ) {
          this.selectedSku[key] = valueId;
        }
      });

      const skuValues = this.selectedSkuValues;

      if (skuValues.length > 0) {
        this.$nextTick(() => {
          this.$emit('sku-selected', {
            skuValue: skuValues[skuValues.length - 1],
            selectedSku: this.selectedSku,
            selectedSkuComb: this.selectedSkuComb,
          });
        });
      }

      // 重置商品属性
      this.selectedProp = {};
      const { selectedProp = {} } = this.initialSku;
      // 选中外部传入信息
      this.propList.forEach((item) => {
        if (selectedProp[item.k_id]) {
          this.selectedProp[item.k_id] = selectedProp[item.k_id];
        }
      });

      if (isEmpty(this.selectedProp)) {
        this.propList.forEach((item) => {
          // 没有加价的属性，默认选中第一个
          if (item?.v?.length > 0) {
            const { v, k_id } = item;
            const isHasConfigPrice = v.some((i) => +i.price !== 0);
            // 没有加价属性
            if (!isHasConfigPrice) {
              // 找到第一个不被禁用的属性
              // 历史如果没有 text_status 字段的，就相当于沿用直接原来的逻辑取第一个属性
              const firstEnableProp = v.find((prop) => prop.text_status !== 0);

              if (firstEnableProp) {
                this.selectedProp[k_id] = [firstEnableProp.id];
              }
            }
          }
        });
      }

      const propValues = this.selectedPropValues;
      if (propValues.length > 0) {
        this.$emit('sku-prop-selected', {
          propValue: propValues[propValues.length - 1],
          selectedProp: this.selectedProp,
          selectedSkuComb: this.selectedSkuComb,
        });
      }

      // 抛出重置事件
      this.$emit('sku-reset', {
        selectedSku: this.selectedSku,
        selectedProp: this.selectedProp,
        selectedSkuComb: this.selectedSkuComb,
      });

      this.centerInitialSku();
    },

    getSkuMessages() {
      return this.$refs.skuMessages ? this.$refs.skuMessages.getMessages() : {};
    },

    getSkuCartMessages() {
      return this.$refs.skuMessages
        ? this.$refs.skuMessages.getCartMessages()
        : {};
    },

    validateSkuMessages() {
      return this.$refs.skuMessages
        ? this.$refs.skuMessages.validateMessages()
        : '';
    },

    validateSku() {
      if (this.selectedNum === 0) {
        return t('unavailable');
      }

      if (this.isSkuCombSelected) {
        return this.validateSkuMessages();
      }

      // 自定义sku校验
      if (this.customSkuValidator) {
        const err = this.customSkuValidator(this);
        if (err) return err;
      }

      return t('selectSku');
    },

    onSelect(skuValue) {
      // 点击已选中的sku时则取消选中
      this.selectedSku =
        this.selectedSku[skuValue.skuKeyStr] === skuValue.id
          ? {
              ...this.selectedSku,
              [skuValue.skuKeyStr]: UNSELECTED_SKU_VALUE_ID,
            }
          : { ...this.selectedSku, [skuValue.skuKeyStr]: skuValue.id };

      this.$emit('sku-selected', {
        skuValue,
        selectedSku: this.selectedSku,
        selectedSkuComb: this.selectedSkuComb,
      });
    },

    onPropSelect(propValue) {
      const arr = this.selectedProp[propValue.skuKeyStr] || [];
      const pos = arr.indexOf(propValue.id);

      if (pos > -1) {
        arr.splice(pos, 1);
      } else if (propValue.multiple) {
        arr.push(propValue.id);
      } else {
        arr.splice(0, 1, propValue.id);
      }

      this.selectedProp = {
        ...this.selectedProp,
        [propValue.skuKeyStr]: arr,
      };

      this.$emit('sku-prop-selected', {
        propValue,
        selectedProp: this.selectedProp,
        selectedSkuComb: this.selectedSkuComb,
      });
    },

    onNumChange(num) {
      this.selectedNum = num;
    },

    onPreviewImage(selectedValue) {
      const { imageList } = this;
      let index = 0;
      let indexImage = imageList[0];
      if (selectedValue && selectedValue.imgUrl) {
        this.imageList.some((image, pos) => {
          if (image === selectedValue.imgUrl) {
            index = pos;
            return true;
          }
          return false;
        });
        indexImage = selectedValue.imgUrl;
      }
      const params = {
        ...selectedValue,
        index,
        imageList: this.imageList,
        indexImage,
      };

      this.$emit('open-preview', params);

      if (!this.previewOnClickImage) {
        return;
      }

      showImagePreview({
        images: this.imageList,
        startPosition: index,
        onClose: () => {
          this.$emit('close-preview', params);
        },
      });
    },

    onOverLimit(data) {
      const { action, limitType, quota, quotaUsed } = data;
      const { handleOverLimit } = this.customStepperConfig;

      if (handleOverLimit) {
        handleOverLimit(data);
        return;
      }

      if (action === 'minus') {
        if (this.startSaleNum > 1) {
          showToast(`${this.startSaleNum}起售`);
        } else {
          showToast('至少选择一件');
        }
      } else if (action === 'plus') {
        if (limitType === QUOTA_LIMIT) {
          if (quotaUsed > 0) {
            showToast(`每人限购${quota}件，你已购买${quotaUsed}件`);
          } else {
            showToast(`每人限购${quota}件`);
          }
        } else {
          showToast("库存不足");
        }
      }
    },

    onStepperState(data) {
      this.stepperError = data.valid
        ? null
        : {
            ...data,
            action: 'plus',
          };
    },

    onAddCart() {
      this.onBuyOrAddCart('add-cart');
    },

    onBuy() {
      this.onBuyOrAddCart('buy-clicked');
    },

    onBuyOrAddCart(type) {
      // sku 不符合购买条件
      if (this.stepperError) {
        return this.onOverLimit(this.stepperError);
      }

      const error = this.validateSku();

      if (error) {
        showToast(error);
      } else {
        this.$emit(type, this.getSkuData());
      }
    },

    // @exposed-api
    getSkuData() {
      return {
        goodsId: this.goodsId,
        messages: this.getSkuMessages(),
        selectedNum: this.selectedNum,
        cartMessages: this.getSkuCartMessages(),
        selectedSkuComb: this.selectedSkuComb,
      };
    },

    // 当 popup 完全打开后执行
    onOpened() {
   
      this.centerInitialSku();
    },

    centerInitialSku() {
    

      (this.$refs.skuRows || []).forEach((it) => {
        const { k_s } = it.skuRow || {};
        it.centerItem(this.initialSku[k_s]);
      });
    },
  },

 
  render() {
    if (this.isSkuEmpty) {
      return;
    }

    const {
      sku,
      skuList,
      goods,
      price,
      lazyLoad,
      originPrice,
      skuEventBus,
      selectedSku,
      selectedProp,
      selectedNum,
      stepperTitle,
      selectedSkuComb,
      showHeaderImage,
      disableSoldoutSku,
      skuRows
    } = this;

    const slotsProps = {
      price,
      originPrice,
      selectedNum,
      skuEventBus,
      selectedSku,
      selectedSkuComb,
    };
    

    const slots = this.$slots;
 
  

   
    const Header = slots['sku-header']?.(slotsProps) || (
      <SkuHeader
        sku={sku}
        goods={goods} 
        skuEventBus={skuEventBus}
        selectedSku={selectedSku}
        showHeaderImage={showHeaderImage}
      >
        {slots['sku-header-image-extra']?.(slotsProps)}
        {slots['sku-header-price']?.(slotsProps) || (
          <div class="van-sku__goods-price">
            <span class="van-sku__price-symbol">￥</span>
            <span class="van-sku__price-num">{price}</span>
            {this.priceTag && (
              <span class="van-sku__price-tag">{this.priceTag}</span>
            )}
          </div>
        )}
        {slots['sku-header-origin-price']?.(slotsProps) ||
          (originPrice && (
            <SkuHeaderItem>
              {t('originPrice')} ￥{originPrice}
            </SkuHeaderItem>
          ))}
        {!this.hideStock && (
          <SkuHeaderItem>
            <span class="van-sku__stock">{this.stockText}</span>
          </SkuHeaderItem>
        )}
        {this.hasSkuOrAttr && !this.hideSelectedText && (
          <SkuHeaderItem>{this.selectedText}</SkuHeaderItem>
        )}
        
      </SkuHeader>
    );
    
    const Group =
      slots['sku-group']?.(slotsProps) ||
      (this.hasSkuOrAttr && (
        <div class={this.skuGroupClass}>
          {this.skuTree.map((skuTreeItem) => (
            <SkuRow skuRow={skuTreeItem} ref={(el) => skuRows.push(el)}>
              {skuTreeItem.v.map((skuValue) => (
                <SkuRowItem
                  skuList={skuList}
                  lazyLoad={lazyLoad}
                  skuValue={skuValue}
                  skuKeyStr={skuTreeItem.k_s}
                  selectedSku={selectedSku}
                  skuEventBus={skuEventBus}
                  disableSoldoutSku={disableSoldoutSku}
                  largeImageMode={skuTreeItem.largeImageMode}
                />
              ))}
            </SkuRow>
          ))}
          {this.propList.map((skuTreeItem) => (
            <SkuRow skuRow={skuTreeItem}>
              {skuTreeItem.v.map((skuValue) => (
                <SkuRowPropItem
                  skuValue={skuValue}
                  skuKeyStr={skuTreeItem.k_id + ''}
                  selectedProp={selectedProp}
                  skuEventBus={skuEventBus}
                  multiple={skuTreeItem.is_multiple}
                  disabled={skuValue.text_status === 0}
                />
              ))}
            </SkuRow>
          ))}
        </div>
      ));
  
     
    const Stepper = slots['sku-stepper']?.(slotsProps) || (
      <SkuStepper
        ref="skuStepper"
        stock={this.stock}
        quota={this.quota}
        quotaUsed={this.quotaUsed}
        startSaleNum={this.startSaleNum}
        skuEventBus={skuEventBus}
        selectedNum={selectedNum}
        stepperTitle={stepperTitle}
        skuStockNum={sku.stock_num}
        disableStepperInput={this.disableStepperInput}
        customStepperConfig={this.customStepperConfig}
        hideQuotaText={this.hideQuotaText}
        onChange={(event) => {
          this.$emit('stepper-change', event);
        }}
      />
    );



    const Actions = slots['sku-actions']?.(slotsProps) || (
      <SkuActions
        buyText={this.buyText}
        skuEventBus={skuEventBus}
        addCartText={this.addCartText}
        showAddCartBtn={this.showAddCartBtn}
      />
    );
  

 
    return (
      <Popup
        v-model:show={this.show}
        round
        closeable
        position="bottom"
        class="van-sku-container"
        getContainer={this.getContainer}
        closeOnClickOverlay={this.closeOnClickOverlay}
        safeAreaInsetBottom={this.safeAreaInsetBottom}
        onOpened={this.onOpened}
      >
       {Header}
        <div class="van-sku-body" style={this.bodyStyle}>
          {slots['sku-body-top']?.(slotsProps)}
          {Group}
          {slots['extra-sku-group']?.(slotsProps)}
          {Stepper}
         
        </div>
        {slots['sku-actions-top']?.(slotsProps)}
        {Actions}
      </Popup>
    );
  },
});
