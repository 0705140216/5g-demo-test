import axios from '@/utils/request'

// 本地调试api前缀
const SERVICE = process.env.NODE_ENV == 'development' ? '/health-common-cma' : '/health-common'

const api = {
  tableList: `${SERVICE}/list/tableList`,
  editTask: `${SERVICE}/list/editTask`,
  getTypeList: `${SERVICE}/device/health/getTypeList` // 设备类型列表
}

export const getTypeList = params => {
  return axios({
    url: api.getTypeList,
    method: 'get',
    params
  })
}

export function getList(params) {
  return axios({
    url: api.tableList,
    method: 'get',
    params
  })
}

export function editTask(data) {
  return axios({
    url: api.editTask,
    method: 'post',
    data
  })
}
