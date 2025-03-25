/*
 * @Author: cwx
 * @Date: 2025-03-25 16:02:57
 * @LastEditTime: 2025-03-25 16:08:42
 * @LastEditors: cwx
 * @Description: 校验相关
 */

/**
 * @description: 校验密码强度
 * @param {string} password 密码
 * @param {boolean} [isAdmin=false] 是否为管理员
 * @returns {boolean} true: 密码强度满足要求; false: 密码强度不满足要求
 */
export function checkPwdStrength(password: string, isAdmin: boolean = false) {
  // 管理员和普通用户密码强度要求不一样
  // 管理员: 必须包含大写字母, 小写字母, 数字, 特殊字符, 长度至少12位
  // 普通用户: 必须包含大写字母, 小写字母, 数字, 特殊字符, 长度至少8位
  const regexStr_1 = isAdmin
    ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{12,}$/
    : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
  // /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/;

  // 不能出现连续的相同字符(123, abc, 等等), 不能出现连续的同一个字符(111, aaa, 等等)
  function checkString(str: string) {
    for (let i = 0; i < str.length - 2; i++) {
      // 检查是否有连续三个相同字符
      let sameCount = 1;
      for (let j = i + 1; j < str.length; j++) {
        if (str[i] === str[j]) {
          sameCount++;
          if (sameCount === 3) {
            return false;
          }
        } else {
          break;
        }
      }

      // 检查是否有连续递增的数字（如123这种情况）
      if (
        /\d/.test(str[i] as string) &&
        /\d/.test(str[i + 1] as string) &&
        /\d/.test(str[i + 2] as string)
      ) {
        const num1 = parseInt(str[i] as string, 10);
        const num2 = parseInt(str[i + 1] as string, 10);
        const num3 = parseInt(str[i + 2] as string, 10);
        if (num2 === num1 + 1 && num3 === num2 + 1) {
          return false;
        }
      }

      // 检查是否有连续递增的字母（如abc这种情况，这里只考虑英文字母且不区分大小写）
      if (
        /[a-zA-Z]/.test(str[i] as string) &&
        /[a-zA-Z]/.test(str[i + 1] as string) &&
        /[a-zA-Z]/.test(str[i + 2] as string)
      ) {
        const code1 = (str[i] as string).toLowerCase().charCodeAt(0);
        const code2 = (str[i + 1] as string).toLowerCase().charCodeAt(0);
        const code3 = (str[i + 2] as string).toLowerCase().charCodeAt(0);
        if (code2 === code1 + 1 && code3 === code2 + 1) {
          return false;
        }
      }
    }
    return true;
  }

  // 使用RegExp构造函数创建正则表达式对象
  const regex_1 = new RegExp(regexStr_1);

  // 使用正则表达式测试密码
  return regex_1.test(password) && checkString(password);
}
