/*
 * @Author: cwx
 * @Date: 2025-03-14 16:01:38
 * @LastEditTime: 2025-03-14 23:43:15
 * @LastEditors: cwx
 * @Description: 路由query处理
 */

import {
  getDecryptByBase64 as decrypt,
  getEncryptToBase64 as encrypt,
} from './encryption';

const encodeReserveRE = /[!'()*]/g;
const encodeReserveReplacer = (c: string) =>
  `%${(c.codePointAt(0) ?? 0).toString(16)}`; // 获取该字符的 ASCII 码值，再将其转换为十六进制字符串，并在前面加上 '%' 作为替换后的结果
const commaRE = /%2C/g; // 英文逗号处理

const encode = (str: string): string =>
  encodeURIComponent(str)
    .replaceAll(encodeReserveRE, encodeReserveReplacer)
    .replaceAll(commaRE, ',');

const decode = decodeURIComponent;

/**
 * 判断字符串是否是base64
 * @param { string } str
 * @returns { boolean }
 */
function isBase64(str: string): boolean {
  // 检查字符串是否为空或仅包含空白字符
  if (!str || str.trim() === '') {
    return false;
  }
  // 正则表达式匹配Base64的字符集，允许末尾有0-2个等号用于填充
  const base64Pattern: RegExp = /^[A-Z0-9+/]*={0,2}$/i;

  // 首先检查字符串是否符合Base64的字符集规范
  if (!base64Pattern.test(str)) {
    return false;
  }

  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * 序列化对象 并加密
 * @param {Record<string, any>} obj
 */
export const stringifyQuery = (obj: Record<string, any>): string => {
  const res: null | string = obj
    ? Object.keys(obj)
        .map((key) => {
          const val = obj[key];
          if (val === null || val === undefined) {
            return encode(key);
          }
          if (Array.isArray(val)) {
            const result: string[] = [];
            val.forEach((v) => {
              if (v === null || v === undefined) {
                result.push(encode(key));
              } else {
                result.push(`${encode(key)}=${encode(v)}`);
              }
            });
            return result.join('&');
          }

          return `${encode(key)}=${encode(val)}`;
        })
        .join('&')
    : null;
  return res ? `${encrypt(res)}` : '';
};

/**
 * 解密  反序列化字符串参数
 * @param {string} query
 */
export const parseQuery = (query: string): Record<string, any> => {
  const res: Record<string, any> = {};

  query = query.trim().replace(/^([?#&])/, '');
  if (!query) {
    return res;
  }
  // 解密
  query = isBase64(query) ? decrypt(query) : query;
  query.split('&').forEach((param: string) => {
    const parts = param.split('=');
    const key = decode(parts.shift() || '');
    const val = parts.length > 0 ? decode(parts.join('')) : null;
    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      // 复原数组
      res[key] = [res[key], val];
    }
  });
  return res;
};
