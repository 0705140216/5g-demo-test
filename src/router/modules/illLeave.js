import { default as mingdan } from '@/assets/icons/mingdan.svg?inline'
export default {
  path: '/ill-leave',
  name: 'IllLeave',
  component: () => import(/* webpackChunkName:"home" */ '_views/ill-leave/ill-leave-list'),
  meta: {
    title: '病假名单',
    keepAlive: true,
    icon: mingdan,
    orgType: 30 // TODO: 暂时用做 学校和政府路由的权限区分
    // permission: 4000
  }
}
