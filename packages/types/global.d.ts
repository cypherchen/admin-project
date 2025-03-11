import type { RouteMeta as IRouteMeta } from '@vben-core/typings';

import 'vue-router';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends IRouteMeta {}
}

export interface VbenAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
  VITE_GLOB_ENV_TYPE: number;
  VITE_GLOB_SSO_URL_PROD: string;
  VITE_GLOB_SSO_URL_TEST: string;
  VITE_GLOB_SSO_CLIENT_ID_PROD: string;
  VITE_GLOB_SSO_CLIENT_ID_TEST: string;
}

export interface ApplicationConfig {
  apiURL: string;
  envType: number;
  ssoUrlProd: string;
  ssoUrlTest: string;
  ssoClientIdProd: string;
  ssoClientIdTest: string;
}

declare global {
  interface Window {
    _VBEN_ADMIN_PRO_APP_CONF_: VbenAdminProAppConfigRaw;
  }
}
