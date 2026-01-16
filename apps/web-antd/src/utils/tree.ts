/*
 * @Author: cwx
 * @Date: 2024-07-12 15:38:34
 * @LastEditTime: 2025-03-25 15:59:10
 * @LastEditors: cwx
 * @Description: 树结构相关
 */

import type { Recordable } from '@vben/types';

export interface TreeItem<T = Recordable<unknown>> {
  [key: string]: any;
  serialNo?: string;
  treeState: {
    level: number;
    pathIDs: string[];
    pathNames: string[];
  };
  children?: TreeItem<T>[];
}

export type TreeExtraProps<T> = TreeItem<T>;

/**
 * @description: 数组转树结构
 * @param {*} data 数组
 * @param {*} key ID
 * @param {*} parentKey Parent_ID
 * @param {*} maxLevel 最大层级
 * @return {*}
 */
export function arrayToTree<T = Recordable<unknown>>(
  data: Array<T>,
  key = 'ID',
  parentKey = 'Parent_ID',
  maxLevel = Infinity,
): Array<TreeItem<T>> {
  if (data.length === 0) return [];

  // 给每个数据新增children和treeState字段
  const hashTable: Record<string, TreeItem<T>> = {};
  data.forEach((_item) => {
    const item = _item as unknown as TreeItem<T>;
    item.serialNo = '';
    item.children = [];
    item.treeState = {
      pathIDs: [],
      pathNames: [],
      level: 0,
    };
    hashTable[item[key] as string] = item;
  });

  // 生成树结构
  const tree: Array<TreeItem<T>> = [];
  data.forEach((_item) => {
    const item = _item as unknown as TreeItem<T>;
    const parentId = item[parentKey as keyof TreeItem<T>] as string | undefined;
    if (!parentId || !hashTable[parentId]) {
      tree.push(item);
    } else {
      const parent = hashTable[parentId];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
  });

  // 递归计算treeState
  const traverse = (
    node: TreeItem<T>,
    level: number,
    pathIDs: string[],
    pathNames: string[],
    serialNo: number | string,
  ) => {
    node.serialNo = serialNo.toString();
    node.treeState.pathIDs = [...pathIDs];
    node.treeState.pathNames = [...pathNames];
    node.treeState.level = level;
    if (level + 1 >= maxLevel) {
      node.children = undefined;
      return;
    }
    if (!node.children || node.children.length === 0) {
      node.children = undefined;
    } else {
      node.children.forEach((child, index) => {
        traverse(
          child,
          level + 1,
          [...node.treeState.pathIDs, node[key as string]],
          [...node.treeState.pathNames, node.Name],
          `${node.serialNo}.${index + 1}`,
        );
      });
    }
  };

  // 从对顶层开始遍历递归
  tree.forEach((node, index) => {
    traverse(node, 0, [], [], index + 1);
  });

  return tree;
}

/**
 * @description: 将树形结构转换为数组
 * @param {Array} tree
 * @return {*}
 */
export function treeToArray(tree: Array<Recordable<unknown>>) {
  const queue: Array<Recordable<unknown>> = [];
  const res: Array<Recordable<unknown>> = [];

  tree.forEach((item) => {
    queue.push(item);
  });

  while (queue.length > 0) {
    const arrItem = queue.shift() as Recordable<unknown>;
    res.push(arrItem);

    if (Array.isArray(arrItem.children)) {
      arrItem.children.forEach((child) => {
        queue.push(child);
      });
    }
  }

  return res;
}
