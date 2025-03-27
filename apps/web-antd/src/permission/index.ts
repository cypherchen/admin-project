/*
 * @Author: cwx
 * @Date: 2025-03-27 16:13:35
 * @LastEditTime: 2025-03-27 18:52:13
 * @LastEditors: cwx
 * @Description: 权限
 */

export interface PermissionModule {
  name: string;
  key: string;
  auth: Array<{ name: string; key: string }>;
  tabs?: Array<{
    name: string;
    key: string;
    auth: Array<{ name: string; key: string }>;
  }>;
}

// 自动导入所有模块文件
const modules = import.meta.glob('./modules/**/*.ts', {
  eager: true,
}) as Record<string, { default: PermissionModule }>;

// 权限转换函数
const transToEnum = (module: PermissionModule) => {
  const auth: Record<string, any> = {};

  // 处理主权限
  auth[module.name] = module.auth.reduce(
    (acc, curr) => {
      acc[curr.name] = curr.key;
      return acc;
    },
    {} as Record<string, string>,
  );

  // 处理页签权限
  module.tabs?.forEach((tab) => {
    auth[tab.name] = {
      key: tab.key,
      ...tab.auth.reduce(
        (acc, curr) => {
          acc[curr.name] = curr.key;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
  });

  return auth;
};

// 生成处理后的权限对象
const processedModules = Object.entries(modules).reduce(
  (acc, [path, module]) => {
    const moduleName =
      path
        .split('/')
        .pop()
        ?.replace('Permission.ts', '')
        .replace(/^\w/, (m) => m.toUpperCase()) + 'Permission';

    if (moduleName) {
      acc[moduleName] = transToEnum(module.default);
    }
    return acc;
  },
  {} as Record<string, ReturnType<typeof transToEnum>>,
);

// 导出所有处理后的权限对象
export const {
  desktopPermission,
  listPreparationPermission,
  autoPricingPermission,
  rapidBidClearingPermission,
  indicatorAnalyzePermission,
  budgetCalculationPermission,
  materialRepositoryPermission,
  listRepositoryPermission,
  projectRepositoryPermission,
} = processedModules;

// 导出原始模块集合
export const permissions = Object.values(modules).map((m) => m.default);
