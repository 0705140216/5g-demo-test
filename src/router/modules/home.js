import { default as iconhome } from '@/assets/icons/iconhome.svg?inline'
export default {
  path: '/home',
  name: 'Home',
  component: () => import(/* webpackChunkName:"home" */ '_views/home'),
  meta: {
    title: '概览',
    keepAlive: true,
    icon: iconhome
    // orgType: 10 // TODO: 暂时用做 学校和政府路由的权限区分
    // permission: 4000
  }
}
