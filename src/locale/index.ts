/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-05 15:16:31
 * @LastEditTime: 2023-01-05 17:21:34
 * @LastEditors: 司马老贼
 */
import Vue from 'vue';
import { deepAssign } from '../utils/deep-assign';
import defaultMessages from './lang/zh-CN';

const proto = Vue.prototype;
const { defineReactive } = (Vue as any).util;

defineReactive(proto, '$vantLang', 'zh-CN');
defineReactive(proto, '$vantMessages', {
  'zh-CN': defaultMessages,
});

export default {
  messages() {
    return proto.$vantMessages[proto.$vantLang];
  },

  use(lang: string, messages?: object) {
    proto.$vantLang = lang;
    this.add({ [lang]: messages });
  },

  add(messages = {}) {
    deepAssign(proto.$vantMessages, messages);
  },
};
