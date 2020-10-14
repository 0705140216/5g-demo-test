import axios from '@/utils/request'

const SERVICE = process.env.NODE_ENV == 'development' ? '/health-common-cmz' : '/health-common'

const api = {
  regionTree: `${SERVICE}/region/tree` // 全部省市区下拉框
}

export default api

export const regionTree = () => {
  return axios({
    url: api.regionTree,
    method: 'get'
  })
}
