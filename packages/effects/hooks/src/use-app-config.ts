import type {
  ApplicationConfig,
  VbenAdminProAppConfigRaw,
} from '@vben/types/global';

/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(
  env: Record<string, any>,
  isProduction: boolean,
): ApplicationConfig {
  // 生产环境下，直接使用 window._VBEN_ADMIN_PRO_APP_CONF_ 全局变量
  const config = isProduction
    ? window._VBEN_ADMIN_PRO_APP_CONF_
    : (env as VbenAdminProAppConfigRaw);

  const {
    VITE_GLOB_API_URL,
    VITE_GLOB_ENV_TYPE,
    VITE_GLOB_SSO_URL_PROD,
    VITE_GLOB_SSO_URL_TEST,
    VITE_GLOB_SSO_CLIENT_ID_PROD,
    VITE_GLOB_SSO_CLIENT_ID_TEST,
  } = config;

  const applicationConfig: ApplicationConfig = {
    apiURL: VITE_GLOB_API_URL,
    envType: VITE_GLOB_ENV_TYPE,
    ssoUrlProd: VITE_GLOB_SSO_URL_PROD,
    ssoUrlTest: VITE_GLOB_SSO_URL_TEST,
    ssoClientIdProd: VITE_GLOB_SSO_CLIENT_ID_PROD,
    ssoClientIdTest: VITE_GLOB_SSO_CLIENT_ID_TEST,
  };
  return applicationConfig;
}
