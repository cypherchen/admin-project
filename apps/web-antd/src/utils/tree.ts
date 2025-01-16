/*
 * @Author: cwx
 * @Date: 2024-07-12 15:38:34
 * @LastEditTime: 2024-12-24 23:24:59
 * @LastEditors: cwx
 * @Description:
 */

import type { Recordable } from '@vben/types';

interface TreeProps<T> {
  [key: string]: any;
  serialNo: string;
  treeState: {
    pathIDs: string[];
    pathNames: string[];
    level: number;
  };
  children: TreeProps<T>[] | null;
}
export type TreeExtraProps<T> = TreeProps<T>;

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
): Array<TreeProps<T>> {
  if (data.length === 0) return [];

  // 给每个数据新增children和treeState字段
  const hashTable: Record<string, TreeProps<T>> = {};
  data.forEach((item: TreeProps<T>) => {
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
  const tree: Array<TreeProps<T>> = [];
  data.forEach((item: Recordable<any>) => {
    if (!item[parentKey] || !data.find((n) => n[key] === item[parentKey])) {
      tree.push(item);
    } else if (hashTable[item[parentKey]]) {
      hashTable[item[parentKey]]!.children!.push(item);
    }
  });

  // 递归计算treeState
  const traverse = (
    node: TreeProps<T>,
    level: number,
    pathIDs: string[],
    pathNames: string[],
    serialNo: string | number,
  ) => {
    node.serialNo = serialNo.toString();
    node.treeState.pathIDs = [...pathIDs];
    node.treeState.pathNames = [...pathNames];
    node.treeState.level = level;
    if (level + 1 >= maxLevel) {
      node.children = null;
      return;
    }
    if (node.children?.length === 0) {
      node.children = null;
    } else {
      node.children!.forEach((child, index) => {
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
