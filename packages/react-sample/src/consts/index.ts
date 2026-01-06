// 定义 Logto 配置类型
type LogtoConfig = {
  [key: string]: string | undefined;
  APP_ID?: string;
  ENDPOINT?: string;
};

// 扩展 Window 接口
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __LOGTO_CONFIG__?: LogtoConfig;
  }
}

export const baseUrl = window.location.origin;
export const redirectUrl = `${baseUrl}/callback`;

// 从环境变量或window对象获取配置,支持运行时动态修改
const getConfigValue = (key: string, defaultValue: string): string => {
  // 1. 优先检查 window.__LOGTO_CONFIG__ (HTML注入)
  if (typeof window !== 'undefined' && window.__LOGTO_CONFIG__?.[key]) {
    return window.__LOGTO_CONFIG__[key] ?? defaultValue;
  }
  // 3. 最后使用默认值
  return defaultValue;
};

export const appId = getConfigValue(
  'APP_ID',
  'l0ztgtbtuua0vyc5ti5ds' // 默认值：Register the sample app in Logto dashboard
);

export const endpoint = getConfigValue(
  'ENDPOINT',
  'https://jerry-test-logto-api.zeabur.app/' // 默认值：Replace with your own Logto endpoint
);
