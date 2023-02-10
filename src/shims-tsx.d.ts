/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-02-10 17:56:11
 * @LastEditTime: 2023-02-10 17:56:56
 * @LastEditors: 司马老贼
 */
import "vue";

type EventHandler = (...args: any[]) => void;

declare module "vue" {
  interface ComponentCustomProps {
  
   
    onChange?: EventHandler;
   
  }
}
