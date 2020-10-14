import { BasicLayout, UserLayout } from '@/layouts'

/* Router Modules */
import home from './modules/home'
import approve from './modules/approve'
import absent from './modules/absent'
import illLeave from './modules/illLeave'

// 开发环境路由
import template from './modules/template'

/**
 * hidden: false                  //控制路由和子路由是否显示在 sidebar，如401、login等页面，或一些编辑页面/edit/1
 * alwaysShow: false              //当路由有且含有一个非隐藏的子路由的情况下，始终显示父级菜单  *暂不可用
 * name:'RouterName'              //路由名称, 必须设置,且不能重名 建议与对应组件的name保持一致
 * hideChildrenInMenu: -          //强制菜单显示为Item而不是SubItem(配合 meta.hidden)
 * meta : {
    title: 'title'                //路由标题, 用于显示面包屑, 页面标题*推荐设置
    icon: 'icon-class-name'       //路由在 menu 上显示的图标
    keepAlive: false              //缓存该路由 (开启 multi-tab 是默认值为 true)
    permission: [100, 200]        //用于路由鉴权，不设置此字段表示无权限限制 单个值可不用[]
  }
 **/

const asyncRoutes = [home, approve, absent, illLeave]

// 开发环境路由
process.env.NODE_ENV === 'development' && asyncRoutes.push(template)

/**
 * 动态路由
 */
export const asyncRouterMap = [
  {
    path: '/',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/home',
    children: asyncRoutes
  },
  {
    path: '*',
    redirect: '/redirect'
  }
]

/**
 * 基础路由
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/login')
      }
    ]
  },
  {
    path: '/redirect',
    component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect')
  }
]
