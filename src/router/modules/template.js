import { PageView } from '@/layouts'

// list
export default {
  path: '/template',
  name: 'Template',
  component: PageView,
  redirect: '/template/table-list',
  meta: { title: '模板管理', icon: 'table' },
  children: [
    {
      path: '/template/table-list',
      name: 'TableList',
      component: () => import(/* webpackChunkName: "template" */ '@/views/template/table-list'),
      meta: { title: '列表模板', keepAlive: true }
    },
    {
      path: '/template/table-list-two',
      name: 'TableListTwo',
      component: () => import(/* webpackChunkName: "template" */ '@/views/template/table-list-two'),
      meta: { title: '列表开发模板', keepAlive: true }
    },
    {
      path: '/template/icons',
      name: 'IconSelect',
      component: () => import(/* webpackChunkName: "template" */ '@/views/template/icons'),
      meta: { title: '图标示例', keepAlive: true }
    },
    {
      path: '/template/test',
      name: 'TestView',
      component: () => import(/* webpackChunkName: "template" */ '@/views/template/test'),
      meta: { title: '测试页', keepAlive: true }
    }
  ]
}
