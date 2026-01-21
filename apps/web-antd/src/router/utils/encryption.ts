/*
 * @Author: cwx
 * @Date: 2025-03-14 16:02:22
 * @LastEditTime: 2025-03-14 16:12:38
 * @LastEditors: cwx
 * @Description: 加密解密
 */

import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';
import CryptoJSCore from 'crypto-js/core';
import Base64 from 'crypto-js/enc-base64';
import Utf8, { parse } from 'crypto-js/enc-utf8';
import ZeroPadding from 'crypto-js/pad-zeropadding';

/*
 * 加密 解密
 */
const keyHex: CryptoJS.lib.WordArray = parse('1111111111111111'); // 十六位数作为密钥
const ivHex: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.random(128 / 8); // 十六位数作为密钥偏移量 随机生成

/**
 * 加密
 * @param {string} key
 * @returns {string}
 */
// 加密后的结果通常是一个CipherParams对象，其中包含了加密后的密文数据，而密文数据本身是一个WordArray对象。同样，在解密过程中，解密后的结果也是一个WordArray对象。
export const getEncrypt = (key: string): string => {
  try {
    key = JSON.stringify(key);
  } catch (error) {
    console.warn(error);
  }
  // key需要是WordArray类型
  return JSON.stringify({
    encrypt: AES.encrypt(key, keyHex, {
      mode: CryptoJSCore.mode.CBC,
      padding: ZeroPadding,
      iv: ivHex,
    }).toString(),
    iv: ivHex,
  });
};

/**
 * 加密后转base64
 * @param {string}} key
 */
export const getEncryptToBase64 = (key: string): string => {
  const encryptStr = getEncrypt(key);
  const wordArray = Utf8.parse(encryptStr); // 转为WordArray对象
  return Base64.stringify(wordArray);
};

/**
 * 解密
 * @param data
 * @returns {string}
 */
export const getDecrypt = (data: string): string => {
  const { encrypt, iv } = JSON.parse(data);
  let decrypted = AES.decrypt(
    {
      ciphertext: Base64.parse(encrypt),
    },
    keyHex,
    {
      mode: CryptoJSCore.mode.CBC,
      padding: ZeroPadding,
      iv,
    },
  ).toString(Utf8); // 转换为指定编码的字符串

  try {
    decrypted = JSON.parse(decrypted);
  } catch (error) {
    console.warn(error);
  }
  return decrypted;
};

/**
 * 对base64数据解密  先解析base64，再做解密
 * @param {string} data
 * @returns {string}
 */
export const getDecryptByBase64 = (data: string): string => {
  // 将Base64字符串转换为WordArray
  const parsedWordArray = Base64.parse(data);
  // WordArray对象转换成一个UTF-8编码的字符串
  const decryptStr = Utf8.stringify(parsedWordArray);

  return getDecrypt(decryptStr);
};
