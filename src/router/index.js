import Vue from 'vue'
import Router from 'vue-router'
import storage from '@/core/store'
import store from '../store'
import { constantRouterMap, asyncRouterMap } from '@/router/routes-match'

import config from '@/config/settings'
import NProgress from 'nprogress'
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { getPageTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { clearPending } from '@/utils/request'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login'] // no redirect whitelist
const loginRoutePath = '/'
const defaultRoutePath = config.path
let router = null

Vue.use(Router)

const createRouter = ({ routerBase } = {}) => {
  router = new Router({
    mode: 'history',
    base: routerBase || '/',
    scrollBehavior: () => ({ y: 0 }),
    routes: [...constantRouterMap, ...asyncRouterMap]
  })

  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    clearPending({}, true)
    next()
    // if (storage.get(ACCESS_TOKEN)) {
    //   if (to.path === loginRoutePath) {
    //     next({ path: defaultRoutePath })
    //     NProgress.done()
    //   } else {
    //     if (store.getters.userId) {
    //       next()
    //       document.title = getPageTitle(to.meta?.title)
    //     } else {
    //       try {
    //         await store.dispatch('user/GetInfo')
    //         await store.dispatch('permission/GenerateRoutes')
    //
    //         // 动态添加可访问 路由
    //         // router.addRoutes(store.getters.addRouters)
    //         const redirect = decodeURIComponent(from.query.redirect || to.path)
    //         // TODO: 政府和学校路帐号路由切换问题
    //         const OrgRouter = ['/ill-leave']
    //         const orgType = store.state.user.orgInfo.orgType
    //         let redirect1 = redirect
    //         if ((orgType === 30 && !OrgRouter.includes(redirect)) || (orgType === 10 && OrgRouter.includes(redirect))) {
    //           redirect1 = '/home'
    //         }
    //
    //         to.path === redirect1 ? next({ ...to, replace: true }) : next({ path: redirect1 })
    //       } catch {
    //         await store.dispatch('user/Logout')
    //         next({ path: loginRoutePath, query: { redirect: to.fullPath } })
    //       }
    //     }
    //   }
    // } else {
    //   if (whiteList.includes(to.name)) {
    //     next()
    //   } else {
    //     next({ path: loginRoutePath, query: { redirect: to.fullPath } })
    //     NProgress.done()
    //   }
    // }
  })

  router.afterEach(() => {
    NProgress.done()
  })

  return router
}

function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 路由实例 输出
export { createRouter, resetRouter, router }
