import axios from 'axios'
import storage from '@/core/store'
import { STORE } from '@/utils/app-store'
import setting from '@/config/settings'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const BASIC = process.env.NODE_ENV == 'development' ? '/health-screen-wxt' : '/health-screen'
const BASIC_STU = process.env.NODE_ENV == 'development' ? '/health-screen' : '/health-screen'

var service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 1000 * 60 * 20
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 获取本地token
    const token = storage.get(ACCESS_TOKEN)

    // 设置请求token
    token && (config.headers['Authorization'] = token)

    // 设置应用applicationId
    const appId = STORE.appId || setting.appId
    config.headers['ApplicationId'] = appId

    return config
  },
  error => {
    Promise.reject(error)
  }
)

const api = {
  downLoadScreenInfo: `${BASIC}/plan/downLoadScreenInfo`, // 下载学校筛查进度excel
  exportCariesScreenDataExcel: `${BASIC_STU}/taskReport/exportCariesScreenDataExcel`, // 下载龋齿检测数据Excel
  exportUncheckedStudentExcel: `${BASIC_STU}/taskReport/exportUncheckedStudentExcel` // 下载未筛查学生名单Excel
}

export default api

export const downLoadScreenInfo = params => {
  return service({
    url: api.downLoadScreenInfo,
    method: 'get',
    responseType: 'blob',
    params
  })
}

export const exportCariesScreenDataExcel = params => {
  return service({
    url: api.exportCariesScreenDataExcel,
    method: 'get',
    responseType: 'blob',
    params
  })
}

export const exportUncheckedStudentExcel = params => {
  return service({
    url: api.exportUncheckedStudentExcel,
    method: 'get',
    responseType: 'blob',
    params
  })
}
