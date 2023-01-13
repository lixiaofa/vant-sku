/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-13 17:28:24
 * @LastEditTime: 2023-01-13 17:49:51
 * @LastEditors: 司马老贼
 */
import Stepper from 'vant/lib/stepper';
export default defineComponent({
    // 启用了类型推导
    
    data(){
        return {
            value: 2
        }
    },
    render() {
       return <Stepper v-model={this.value} />

      },
  })
