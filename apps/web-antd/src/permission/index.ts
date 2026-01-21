/*
 * @Author: cwx
 * @Date: 2025-03-27 16:13:35
 * @LastEditTime: 2026-01-21 10:54:39
 * @LastEditors: cwx
 * @Description: 权限
 */

export interface PermissionModule {
  name: string;
  key: string;
  auth: Array<{ key: string; name: string }>;
  tabs?: Array<{
    auth: Array<{ key: string; name: string }>;
    key: string;
    name: string;
  }>;
}

// 自动导入所有模块文件
const modules = import.meta.glob('./modules/**/*.ts', {
  eager: true,
}) as Record<string, { default: PermissionModule }>;

// 权限转换函数
const transToEnum = (module: PermissionModule) => {
  const tabsAuth = module.tabs
    ? Object.fromEntries(
        module.tabs.map((tab) => [
          tab.name,
          {
            key: tab.key,
            ...Object.fromEntries(
              tab.auth.map((curr) => [curr.name, curr.key]),
            ),
          },
        ]),
      )
    : {};

  return {
    [module.name]: Object.fromEntries(
      module.auth.map((curr) => [curr.name, curr.key]),
    ),
    ...tabsAuth,
  };
};

// 生成处理后的权限对象
const processedModules = Object.fromEntries(
  Object.entries(modules)
    .map(([path, module]) => {
      const moduleName = `${path
        .split('/')
        .pop()
        ?.replace('Permission.ts', '')
        .replace(/^\w/, (m) => m)}Permission`;

      if (moduleName) {
        return [moduleName, transToEnum(module.default)];
      }
      return null;
    })
    .filter((item) => item !== null),
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
