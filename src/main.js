// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import './public-path'
import './plugins/charts'
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import store from './store'
import appStore from '@/utils/app-store'

import './core/library'
import './assets/styles/index.less'

Vue.config.productionTip = false

let instance = null
let router = null
const __qiankun__ = window.__POWERED_BY_QIANKUN__

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render({ routerBase, container } = {}) {
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = createRouter({ routerBase })

  // 挂载应用
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// 独立运行时，直接挂载应用
__qiankun__ || render()

export async function bootstrap(props) {
  appStore(props)
}

export async function mount(props) {
  render(props)
}

export async function unmount() {
  instance.$destroy?.()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}

export async function update(props) {
  console.log('update props', props)
}
