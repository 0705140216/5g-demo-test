import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import themePluginConfig from '../../config/themePluginConfig'
// 语言设置：此处设置作用全局，应该与antd语言配置保持一致
moment.locale('zh-cn')

window.umi_plugin_ant_themeVar = themePluginConfig.theme

// base library
import '@/core/antd'
import Viser from 'viser-vue'
// viser 全局主题颜色字体样式配置  参照https://viserjs.github.io/theme.html下载主题模板
import custom from '../components/Charts/custom' // 仅修改辅助线2px

// ext library
import Bus from './bus'

// 打印
import Print from './print'

// 全局组件
import MultiTab from '@/components/MultiTab'
import { SvgIcon } from '@/core/icons'

import {
  STable,
  Ellipsis,
  Empty,
  RadioSelect,
  DropSelector,
  DropCascader,
  IconTip,
  RangePicker,
  RemoteSelect,
  CheckboxSelect,
  TreeSelect,
  TreeCheckbox,
  BreadCrumb
} from '../components'

// 全局指令和过滤器
import directives from './directives'
import * as filters from '@/utils/filter'

// vue实例附加类
import axios from 'axios'
import storage from './store'
import * as global from './constants'

Vue.prototype.$axios = axios
Vue.prototype.$g = global
Vue.prototype.$storage = storage

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(directives)

Vue.component('svg-icon', SvgIcon)
Vue.component('s-table', STable)
Vue.component('ellipsis', Ellipsis)
Vue.component('empty', Empty)
Vue.component('radio-select', RadioSelect)
Vue.component('drop-selector', DropSelector)
Vue.component('drop-cascader', DropCascader)
Vue.component('icon-tip', IconTip)
Vue.component('range-picker', RangePicker)
Vue.component('remote-select', RemoteSelect)
Vue.component('checkbox-select', CheckboxSelect)
Vue.component('tree-select', TreeSelect)
Vue.component('tree-checkbox', TreeCheckbox)
Vue.component('bread-crumb', BreadCrumb)

Vue.use(Bus)
Vue.use(MultiTab)
Vue.use(Viser)
Vue.use(Print)

const { Global } = window.G2
Global.registerTheme('myTheme', custom)
Global.setTheme('myTheme')
