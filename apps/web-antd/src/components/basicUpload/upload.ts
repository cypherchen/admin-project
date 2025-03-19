/*
 * @Author: cwx
 * @Date: 2025-03-16 01:17:40
 * @LastEditTime: 2025-03-17 23:35:41
 * @LastEditors: cwx
 * @Description:
 */
import BMF from 'browser-md5-file';
import { useAppConfig } from '@vben/hooks';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

/**
 * @description 计算文件MD5
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function getFileMd5(file: File): Promise<string> {
  const bmf = new BMF();
  return new Promise((resolve, reject) => {
    bmf.md5(file, (err: any, md5: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(md5);
      }
    });
  });
}

/**
 * @description 格式化文件
 * @param {Record<string, any>} file
 * @returns {Record<string, any>}
 */
export function formatFile(file: Record<string, any>) {
  Object.assign(file, {
    name: `${file.FileName}${file.Suffix}`,
    uid: file.FileID,
    size: file.Length,
    type: file.ContentType,
    md5: file.MD5Code,
    url: file.FileUrl,
    thumbUrl: apiURL + file.FileUrl,
    status: 'done',
    response: { Value: file },
  });

  return file;
}
