import axios from '@/utils/request'

const api = {
  queryHospital: `/dict/queryHospital`, // 获取医院列表
  queryDoctor: `/dict/queryDoctor`, // 获取医生列表
  queryPre: `dict/queryPre`, // 根据诊断id获取处方编号
  createPrescription: `/prescription/create`, // 开处方
  cancelPrescription: `/prescription/cancel` // 撤销处方
}

/**
 * @description 获取医生列表
 */
export const queryHospital = params => {
  return axios({
    url: api.queryHospital,
    method: 'get',
    params
  })
}

/**
 * @description 获取医院列表
 */
export const queryDoctor = params => {
  return axios({
    url: api.queryDoctor,
    method: 'get',
    params
  })
}

/**
 * @description 根据诊断id获取处方编号
 */
export const queryPre = params => {
  return axios({
    url: api.queryPre,
    method: 'get',
    params
  })
}

/**
 * @description 开处方
 */
export const createPrescription = data => {
  return axios({
    url: api.createPrescription,
    method: 'post',
    data
  })
}

/**
 * @description 撤销处方
 */
export const cancelPrescription = data => {
  return axios({
    url: api.cancelPrescription,
    method: 'post',
    data
  })
}

export default api
