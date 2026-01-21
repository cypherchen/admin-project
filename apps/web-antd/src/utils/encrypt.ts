/*
 * @Author: cwx
 * @Date: 2025-03-25 15:53:58
 * @LastEditTime: 2025-03-25 15:57:24
 * @LastEditors: cwx
 * @Description: 加密相关
 */

import CryptoJS from 'crypto-js';

const defaultKey = 'F4D5AD45AC9B4DA9BBF700CFFE06C535';

/**
 * @description: AES加密
 * @param {string} str 需要加密的字符串
 * @param {string} [key] 加密的key
 * @returns {string} 加密后的字符串
 */
export function encrypt(str: string, key: string = defaultKey) {
  const content = str;
  key = CryptoJS.enc.Utf8.parse(key);
  const encryptResult = CryptoJS.AES.encrypt(content, key, {
    iv: CryptoJS.enc.Utf8.parse(''), // 不设置偏移量
    mode: CryptoJS.mode.CBC, // aes加密模式cbc
    padding: CryptoJS.pad.Pkcs7, // 填充
  });
  const result = String(encryptResult); // 把object转化为string
  return result;
}

/**
 * @description: AES解密
 * @param {string} str 需要解密的字符串
 * @returns {string} 解密后的字符串
 */
export function decrypt(str: string) {
  const content = str;
  const key = CryptoJS.enc.Utf8.parse(defaultKey);
  const bytes = CryptoJS.AES.decrypt(content.toString(), key, {
    iv: CryptoJS.enc.Utf8.parse(''),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptResult = bytes.toString(CryptoJS.enc.Utf8);
  return decryptResult;
}
