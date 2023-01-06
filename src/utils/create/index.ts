/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-05 14:54:38
 * @LastEditTime: 2023-01-05 16:04:43
 * @LastEditors: 司马老贼
 */
import { createBEM, BEM } from './bem';
import { createComponent } from './component';
import { createI18N, Translate } from './i18n';

type CreateNamespaceReturn = [
  ReturnType<typeof createComponent>,
  BEM,
  Translate
];

export function createNamespace(name: string): CreateNamespaceReturn {
  name = 'van-' + name;
  return [createComponent(name), createBEM(name), createI18N(name)];
}
