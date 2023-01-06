/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-05 14:54:38
 * @LastEditTime: 2023-01-05 15:52:27
 * @LastEditors: 司马老贼
 */
import { get, isFunction } from '..';
import { camelize } from '../format/string';
console.log('222')
import locale from '../../locale';

export function createI18N(name: string) {
  const prefix = camelize(name) + '.';

  return function (path: string, ...args: any[]): string {
    const messages = locale.messages();
    const message = get(messages, prefix + path) || get(messages, path);

    return isFunction(message) ? message(...args) : message;
  };
}

export type Translate = ReturnType<typeof createI18N>;
