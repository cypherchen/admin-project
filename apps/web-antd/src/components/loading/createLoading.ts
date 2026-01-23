/*
 * @Author: cwx
 * @Date: 2026-01-23 11:16:28
 * @LastEditTime: 2026-01-23 15:23:36
 * @LastEditors: cwx
 * @Description:
 */
import type { VNode } from 'vue';

import type { LoadingProps } from './typing';

import { createVNode, h, reactive, render } from 'vue';

import Loading from './Loading.vue';

/**
 * 创建一个全局 loading 实例
 * @param props Loading 属性
 * @param target 挂载 loading 组件的目标元素
 */
export function createLoading(
  props?: Partial<LoadingProps>,
  target?: HTMLElement | string,
) {
  let vm: null | VNode = null;
  const data = reactive<Partial<LoadingProps>>({
    tip: '',
    loading: true,
    ...props,
  });

  const LoadingWrap = {
    render() {
      return h(Loading, { ...data } as LoadingProps);
    },
  };

  vm = createVNode(LoadingWrap);

  // 确定挂载目标
  let parent: HTMLElement | null = null;
  if (target) {
    parent =
      typeof target === 'string' ? document.querySelector(target) : target;
  }

  // 默认为 body
  if (!parent) {
    parent = document.body;
  }

  // 如果请求了绝对定位（或者因为挂载在特定目标上而隐含了绝对定位），则确保父级具有定位属性
  // 如果目标是 body，我们通常使用 fixed 定位（如果不是 absolute，Loading.vue 默认为 fixed）。
  // 如果目标是元素，我们强制使用 absolute 定位。
  if (parent !== document.body) {
    data.absolute = true;
    const position = getComputedStyle(parent).position;
    if (!['absolute', 'fixed', 'relative'].includes(position)) {
      parent.style.position = 'relative';
    }
  }

  // 创建容器并挂载
  const container = document.createElement('div');
  parent.append(container);
  render(vm, container);

  /**
   * 关闭 loading 实例
   */
  function close() {
    if (vm?.component?.props) {
      data.loading = false;
    }
    destroy();
  }

  /**
   * 打开 loading 实例
   */
  function open() {
    if (vm?.component?.props) {
      data.loading = true;
    }
  }

  /**
   * 更新提示内容
   * @param tip 新的提示内容
   */
  function setTip(tip: string | VNode) {
    data.tip = tip;
  }

  /**
   * 设置 loading 状态
   * @param loading loading 状态
   */
  function setLoading(loading: boolean) {
    data.loading = loading;
  }

  /**
   * 销毁 loading 实例并从 DOM 中移除
   */
  function destroy() {
    if (container) {
      render(null, container);
      container.remove();
      vm = null;
    }
  }

  return {
    vm,
    close,
    open,
    setTip,
    setLoading,
    destroy,
    get $el() {
      return vm?.el as HTMLElement;
    },
  };
}
