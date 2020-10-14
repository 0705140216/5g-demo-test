/**
 * Custom icon list
 * All icons are loaded here for easy management
 * @see https://www.antdv.com/components/icon-cn/#components-icon-demo-custom-icon
 *
 * 自定义图标加载表
 * 所有图标均从这里加载，方便管理
 */

import settings from '@/config/settings'
// export { default as diagnosis } from '@/assets/icons/diag.svg?inline' // path to your '*.svg?inline' file.

import { Icon } from 'ant-design-vue'

export const SvgIcon = Icon.createFromIconfontCN({
  scriptUrl: settings.iconfontUrl,
  extraCommonProps: {
    style: {
      fontSize: 'inherit'
    }
  }
})
