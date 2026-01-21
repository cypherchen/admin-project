/*
 * @Author: cwx
 * @Date: 2025-03-25 15:47:02
 * @LastEditTime: 2026-01-21 11:00:42
 * @LastEditors: cwx
 * @Description: 下载相关
 */

import { useAppConfig } from '@vben/hooks';

/**
 * @description: 下载文件
 * @param {BlobPart} data 文件数据
 * @param {string} filename 文件名
 * @param {string} [mime] 文件类型
 * @param {BlobPart} [bom] bom头
 * @return {void}
 */
export function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart,
) {
  const blobData = bom === undefined ? [data] : [bom, data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (tempLink.download === undefined) {
    tempLink.setAttribute('target', '_self');
  }
  document.body.append(tempLink);
  tempLink.click();
  tempLink.remove();
  window.URL.revokeObjectURL(blobURL);
}

/**
 * @description: 通过 url 下载文件
 * @param {object} options
 * @param {string} options.url 文件 url
 * @param {string} [options.target] 打开方式
 * @param {string} [options.fileName] 文件名
 * @return {boolean} 是否成功
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  fileName?: string;
  target?: string;
  url: string;
}) {
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome');
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari');

  if (/iP/.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a');

    const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

    const baseUrl = apiURL || window.location.origin;

    link.href = baseUrl + url;

    link.target = target;

    if (link.download !== undefined) {
      link.download = fileName || url.slice(url.lastIndexOf('/') + 1);
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (!url.includes('?')) {
    url += '?download';
  }

  window.open(url, target);
  return true;
}
