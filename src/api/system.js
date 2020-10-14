import axios from '@/utils/request'

// 微服务地址
const SERVICE = process.env.NODE_ENV == 'development' ? '/health-auth' : '/health-auth'

const api = {
  login: `${SERVICE}/system/login`,
  logout: `${SERVICE}/system/logout`,
  publicKey: `${SERVICE}/system/rsa/publicKey`, // 获取rsa公钥
  userInfo: `${SERVICE}/user/detail`, // 获取用户信息
  permissions: `${SERVICE}/permission/application/permissions`, // 获取用户权限id集合
  userDataRange: `${SERVICE}/userDataRange`, // 登录后获取某个机构下的数据范围省市区
  getCaptcha: `${SERVICE}/captcha` // 获取图像验证码
}

export const getCaptcha = () => {
  return axios({
    url: api.getCaptcha,
    method: 'get'
  })
}

export const login = data => {
  return axios({
    url: api.login,
    method: 'post',
    data
  })
}

export const logout = () => {
  return axios({
    url: api.logout,
    method: 'post'
  })
}

export const getPublicKey = () => {
  return axios({
    url: api.publicKey,
    method: 'get'
  })
}

export const getUserInfo = userId => {
  return axios({
    url: api.userInfo,
    method: 'get',
    params: {
      userId
    }
  })
}

export const getPermission = () => {
  return axios({
    url: api.permissions,
    method: 'get'
  })
}

export const userDataRange = () => {
  return axios({
    url: api.userDataRange,
    method: 'get'
  })
}
