import { default as shenpi } from '@/assets/icons/iconshenpi.svg?inline'
export default {
  path: '/approve',
  name: 'Approve',
  component: () => import(/* webpackChunkName:"home" */ '_views/approve/approve-list'),
  meta: {
    title: '请假审批',
    keepAlive: true,
    icon: shenpi,
    orgType: 10 // TODO: 暂时用做 学校和政府路由的权限区分
    // permission: 4000
  }
}
