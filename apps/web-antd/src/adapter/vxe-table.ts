import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd';
import { Button, Image } from 'ant-design-vue';

import { useVbenForm } from './form';

import { AuditStatus } from '#/components/auditStatus';
import { NumberRange } from '#/components/numberRange';
import { RegionSelector } from '#/components/regionSelector';
import { UnitSelector } from '#/components/unitSelector';

import '@vxe-ui/plugin-render-antd/dist/style.css';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    // 安装antd插件
    vxeUI.use(VxeUIPluginRenderAntd);

    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: true,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        pagerConfig: {
          pageSize: 30,
          pageSizes: [15, 30, 50, 100, 200],
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'List',
            total: 'Count',
            list: 'List',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        treeConfig: {
          transform: true,
          rowField: 'ID',
          parentField: 'Parent_ID',
          childrenField: 'children',
          reserve: true,
          indent: 5,
        },
        rowConfig: {
          isHover: true,
          keyField: 'ID',
        },
        editConfig: {
          mode: 'cell',
          trigger: 'click',
        },
        scrollX: { enabled: true, gt: 20 },
        scrollY: { enabled: true, gt: 50 },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(renderOpts, params) {
        const { props } = renderOpts;
        const { column, row } = params;
        return h(Image, { src: row[column.field], ...props });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    // 表格配置项可以用 cellRender: { name: 'AuditStatus' },
    vxeUI.renderer.add('AuditStatus', {
      renderTableDefault(_, params) {
        const { row } = params;
        return h(AuditStatus, { status: row.AuditStatus, record: row });
      },
    });

    vxeUI.renderer.add('RegionSelector', {
      renderEdit(renderOpts, params) {
        const { row, column } = params;
        const field = column.field as string;
        const value = row[field];
        const props = renderOpts.props || {};
        return h(RegionSelector, {
          value,
          'onUpdate:value': (val: string) => {
            row[field] = val;
          },
          ...props,
        });
      },
    });

    vxeUI.renderer.add('NumberRange', {
      renderEdit(renderOpts, params) {
        const { row, column } = params;
        const field = column.field as string;
        const value = row[field];
        const props = renderOpts.props || {};
        return h(NumberRange, {
          value,
          'onUpdate:value': (
            val: [number | undefined, number | undefined] | undefined,
          ) => {
            row[field] = val;
          },
          ...props,
        });
      },
    });

    vxeUI.renderer.add('UnitSelector', {
      renderEdit(renderOpts, params) {
        const { row, column } = params;
        const field = column.field as string;
        const value = row[field];
        const props = renderOpts.props || {};
        return h(UnitSelector, {
          value,
          'onUpdate:value': (val: string) => {
            row[field] = val;
          },
          ...props,
        });
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
