import axios from 'axios'
import storage from '@/core/store'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { STORE } from '@/utils/app-store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import setting from '@/config/settings'
import { routerGo } from '@/utils/util'
import { isIE } from '@/utils/util'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 20 * 1000 // 请求超时时间
})

/**
 * 请求队列
 * @description 过滤重复请求，路由跳转时取消当前所有pending中的请求
 */
const pendings = []

// request interceptor
service.interceptors.request.use(
  async config => {
    // 取消重复请求：先前的请求
    clearPending(config)

    // 解决ie请求缓存问题
    if (isIE()) {
      let { params = {} } = config
      config.method === 'get' && (params = { ...params, t: new Date().getTime() })
    }

    // 获取本地token
    const token = storage.get(ACCESS_TOKEN)

    // 设置请求token
    token && (config.headers['Authorization'] = token)

    // 设置应用applicationId
    config.headers['ApplicationId'] = STORE.appId || setting.appId

    // 获取取消请求方法
    config.cancelToken = new axios.CancelToken(cancel => {
      pendings.push({ url: getUrl(config), cancel })
    })

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 状态码
 * 1、判定为成功的白名单code列表
 * 2、需重定向的code列表
 */
// const successCodes = ['200']
// const ridrectCodes = ['600', '601', '605', '612', '614', '616']

// response interceptor
service.interceptors.response.use(response => {
  const { data, config } = response

  // 在请求完成后，自动移出队列
  setTimeout(clearPending, 0, config)

  if (data.code == 200) {
    return data
  } else {
    notification.error({
      message: '提示',
      description: data?.message || '请求出现错误，请稍后再试'
    })
    return Promise.reject(data)
  }
  // if (data.success) {
  //   return data
  // } else {
  //   if (ridrectCodes.includes(data.code)) {
  //     const token = storage.get(ACCESS_TOKEN)
  //
  //     token &&
  //       store.dispatch('user/Logout').then(() => {
  //         setTimeout(() => {
  //           window.location.reload()
  //         }, 1500)
  //       })
  //   }
  //
  //   // 当用户权限发生了变更
  //   if (data.code === '602') {
  //     store.dispatch('UpdatePermissions')
  //   }
  //
  //   // 应用权限变更时
  //   if (data.code === '617') {
  //     routerGo('/apps') // 返回主应用
  //     STORE.store?.dispatch('UpdatePermissions') // 更新主应用权限
  //   }
  //
  //   notification.error({
  //     message: '提示',
  //     description: data?.message || '请求出现错误，请稍后再试'
  //   })
  //
  //   return Promise.reject(data)
  // }
}, httpErrorHandler)

// error回调
function httpErrorHandler(error) {
  if (axios.isCancel(error)) {
    console.log(error.message)
    return Promise.reject()
  }

  const { config, response } = error

  // 在请求完成后，自动移出队列
  setTimeout(clearPending, 0, config)

  notification.error({
    message: '提示',
    description: response ? '系统开小差了，请联系管理人员！' : '您的网络不稳定，请检查后重试！'
  })

  return Promise.reject(error)
}

/**
 * 清除请求队列
 */
function clearPending(config, allCancel) {
  if (allCancel) {
    // 在全局路由守卫中引用 跳转前取消当前所有pending中的请求
    pendings.forEach(i => i.cancel(`${i.url} 请求被取消`))
  } else {
    const len = pendings.length
    const curUrl = len && getUrl(config)

    for (let i = 0; i < len; i++) {
      const { url, cancel } = pendings[i]

      if (url === curUrl) {
        cancel(`${config.url} 重复请求被取消！`)
        pendings.splice(i, 1)
        return
      }
    }
  }
}

// url + method + params 相同 被视为重复请求
function getUrl({ url, method, data, params }) {
  // 不参与计算 的参数 置空
  const unCompare = { t: '' }

  const query = data || { ...params, ...unCompare } || {}
  const queryStr = JSON.stringify(query)

  return `${url}_${method}_${queryStr}`
}

export { clearPending }
export default service
