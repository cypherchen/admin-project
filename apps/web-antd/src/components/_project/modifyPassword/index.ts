import type { ModifyPasswordProps } from './props';

/*
 * @Author: cwx
 * @Date: 2025-03-26 10:59:16
 * @LastEditTime: 2025-03-26 11:21:40
 * @LastEditors: cwx
 * @Description:
 */
import { createVNode, render } from 'vue';

import modifyPassword from './modifyPassword.vue';

export * from './props';

export function createModifyPassword(options: ModifyPasswordProps) {
  const div = document.createElement('div');
  document.body.append(div);
  const vm = createVNode(modifyPassword, options);
  render(vm, div);
}
