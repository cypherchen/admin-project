/*
 * @Author: cwx
 * @Date: 2025-03-20 15:42:14
 * @LastEditTime: 2025-03-23 00:47:47
 * @LastEditors: cwx
 * @Description: 查看审批
 */
import { createVNode, render } from 'vue';
import viewAudit from './viewAudit.vue';
import type { ViewAuditProps } from './props';

export * from './props';

export function createViewAuditModal(options: ViewAuditProps) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const vm = createVNode(viewAudit, options);
  render(vm, div);
}
