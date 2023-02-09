/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-06 11:17:41
 * @LastEditTime: 2023-02-09 11:30:36
 * @LastEditors: 司马老贼
 */


// Components
import Sku from './Sku';


import './index.less'
Sku.install = function(app){
  app.component(Sku.name , Sku)
}
export default Sku;

