/*
 * @Author: cwx
 * @Date: 2025-03-20 15:42:05
 * @LastEditTime: 2025-03-22 23:11:17
 * @LastEditors: cwx
 * @Description: 发起审批
 */
import { createVNode, render } from 'vue';
import submitAudit from './submitAudit.vue';
import type { SubmitAuditProps } from './props';

export * from './props';

export function createSubmitAuditModal(options: SubmitAuditProps) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const vm = createVNode(submitAudit, options);
  render(vm, div);
}
