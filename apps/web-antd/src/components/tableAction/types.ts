/*
 * @Author: cwx
 * @Date: 2025-03-20 09:00:51
 * @LastEditTime: 2025-03-20 14:56:03
 * @LastEditors: cwx
 * @Description:
 */
import type { ButtonProps, TooltipProps } from 'ant-design-vue';
interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

export interface ActionItem extends ButtonProps {
  onClick?: Fn;
  label?: string;
  color?: 'success' | 'error' | 'warning';
  icon?: string;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  model?: 'confirm' | 'button';
  // 权限编码控制是否显示
  auth?: string;
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
  tooltip?: string | TooltipProps;
}

export interface PopConfirm {
  title?: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight';
}
