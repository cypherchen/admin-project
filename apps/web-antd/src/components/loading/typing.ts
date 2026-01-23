import type { Component, VNode } from 'vue';

export interface LoadingProps {
  /** Loading 提示内容 */
  tip?: Component | string | VNode;
  /** Loading 尺寸 */
  size?: 'default' | 'large' | 'small';
  /** 是否使用绝对定位 */
  absolute?: boolean;
  /** 是否显示 loading */
  loading?: boolean;
  /** 自定义图标 */
  icon?: Component | string;
  /** 延迟配置 */
  delay?: number | { hide?: number; show?: number };
  /** loading 显示前的回调。如果返回 false，则不显示 loading */
  beforeLoading?: () => boolean | Promise<boolean>;
  /** loading 隐藏后的回调 */
  afterLoading?: () => void;
  /** 挂载的目标元素 */
  target?: HTMLElement | string;
}
