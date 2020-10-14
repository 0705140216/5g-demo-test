import { default as yinbingqueke } from '@/assets/icons/yinbingqueke.svg?inline'
export default {
  path: '/absent',
  name: 'Absent',
  component: () => import(/* webpackChunkName:"home" */ '_views/absent/absent-list'),
  meta: {
    title: '因病缺课',
    keepAlive: true,
    icon: yinbingqueke,
    orgType: 10 // TODO: 暂时用做 学校和政府路由的权限区分
    // permission: 4000
  }
}
