/*
 * @Author: cwx
 * @Date: 2025-03-25 15:58:23
 * @LastEditTime: 2025-03-25 16:02:05
 * @LastEditors: cwx
 * @Description: 数字相关
 */

/**
 * @description: 通过eval计算表达式的值
 * @param {string} expression - 一个合法的JavaScript表达式
 * @returns {number|null} - 如果表达式合法且计算结果为有效的数值，返回对应的数值；否则，返回null
 */
export function calcExpr(expression: string) {
  try {
    // eslint-disable-next-line no-eval
    const result = eval(expression);

    if (typeof result !== 'number' || Number.isNaN(result)) {
      throw new TypeError('表达式结果为非数字');
    }
    if (result === Infinity || result === -Infinity) {
      throw new Error('0不能作为除数');
    }
    return result;
  } catch (error: any) {
    // 如果捕获到错误，说明表达式不合法或计算结果不是有效的数值
    console.error('非法表达式:', error.message);
    return null;
  }
}

/**
 * @description: 格式化数字价格，添加逗号分隔符
 * @param {number|string} price - 一个数字或数字字符串
 * @returns {string} - 格式化后的数字字符串
 */
export function formatPrice(price?: null | number | string) {
  if (
    price === null ||
    price === undefined ||
    price === '' ||
    price === 0 ||
    price === '0'
  ) {
    return '';
  }
  // 去除价格中的逗号，防止重复格式化
  const cleanedPrice = price.toString().replaceAll(',', '');
  // 使用正则表达式和replace方法格式化数字
  // \B 匹配非单词边界的位置
  // (?=(\d{3})+(?!\d)) 是一个正向预查，匹配数字每三位之前的位置（但不包括这些数字本身）
  // $&, 在replace函数的第二个参数中，表示匹配到的字符串，即原数字字符串中每个三位数字前的位置
  // 替换为逗号加原位置（即在这些位置前加上逗号）
  return cleanedPrice.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
}
