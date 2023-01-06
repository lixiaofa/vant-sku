/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 11:17:41
 * @LastEditTime: 2023-01-06 12:29:20
 * @LastEditors: 司马老贼
 */
import { defineComponent  } from 'vue'

import { createNamespace } from 'vant/lib/utils';

const [name] = createNamespace('sku-row-prop-item');

export default defineComponent({
  name,
  props: {
    skuValue: Object,
    skuKeyStr: String,
    skuEventBus: Object,
    selectedProp: Object,
    multiple: Boolean,
    disabled: Boolean,
  },

  computed: {
    choosed() {
      const { selectedProp, skuKeyStr, skuValue } = this;

      if (selectedProp && selectedProp[skuKeyStr]) {
        return selectedProp[skuKeyStr].indexOf(skuValue.id) > -1;
      }

      return false;
    },
  },

  methods: {
    onSelect() {
      if (this.disabled) return;

      this.skuEventBus.$emit('sku:propSelect', {
        ...this.skuValue,
        skuKeyStr: this.skuKeyStr,
        multiple: this.multiple,
      });
    },
  },

  render() {
    return (
      <span
        class={[
          'van-sku-row__item',
          { 'van-sku-row__item--active': this.choosed },
          { 'van-sku-row__item--disabled': this.disabled },
        ]}
        onClick={this.onSelect}
      >
        <span class="van-sku-row__item-name">{this.skuValue.name}</span>
      </span>
    );
  },
});
