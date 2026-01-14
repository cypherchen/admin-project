/*
 * @Author: cwx
 * @Date: 2025-01-20 22:21:39
 * @LastEditTime: 2025-03-31 10:25:05
 * @LastEditors: cwx
 * @Description: 权限相关
 */
import { useAccessStore, useUserStore } from '@vben/stores';

// 权限缓存, 避免操作列的权限重复执行includes函数, 造成性能的严重浪费
const PERMISSION_CACHE: Record<string, boolean> = {};

export function hasPermission(
  value?: string,
  level: 'auth' | 'menu' = 'auth',
): boolean {
  // 没有值的情况下默认显示
  if (!value) return true;

  const accessStore = useAccessStore();
  const userStore = useUserStore();

  // 管理员显示全部;
  const isAdmin = userStore.userInfo?.IsAdmin;
  if (isAdmin) return true;

  if (PERMISSION_CACHE[value] !== undefined) {
    return PERMISSION_CACHE[value];
  }

  // 缓存结果
  PERMISSION_CACHE[value] =
    level === 'auth'
      ? accessStore.accessCodes.includes(value)
      : accessStore.accessMenuCodes.includes(value);

  return PERMISSION_CACHE[value];
}
