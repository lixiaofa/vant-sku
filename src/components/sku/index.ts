/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 11:17:41
 * @LastEditTime: 2023-01-29 18:08:26
 * @LastEditors: 司马老贼
 */
// Utils
// import lang from './lang';
// import constants from './constants';
// import skuHelper from './utils/sku-helper';

// Components
import Sku from './Sku';

// import Locale from '../locale';
// import SkuActions from './components/SkuActions';
// import SkuHeader from './components/SkuHeader';
// import SkuHeaderItem from './components/SkuHeaderItem';
// import SkuMessages from './components/SkuMessages';
// import SkuStepper from './components/SkuStepper';
// import SkuRow from './components/SkuRow';
// import SkuRowItem from './components/SkuRowItem';
// import SkuRowPropItem from './components/SkuRowPropItem';

// Locale.add(lang);

// Sku.SkuActions = SkuActions;
// Sku.SkuHeader = SkuHeader;
// Sku.SkuHeaderItem = SkuHeaderItem;
// Sku.SkuMessages = SkuMessages;
// Sku.SkuStepper = SkuStepper;
// Sku.SkuRow = SkuRow;
// Sku.SkuRowItem = SkuRowItem;
// Sku.SkuRowPropItem = SkuRowPropItem;
// Sku.skuHelper = skuHelper;
// Sku.skuConstants = constants;

// export default Sku;
export default {
  install: (app, options) => {
    // 在这里编写插件代码
    app.component(Sku.name , Sku)
  }
}
