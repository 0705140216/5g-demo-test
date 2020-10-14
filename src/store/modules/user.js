import storage from '@/core/store'
import { router, resetRouter } from '@/router'
import { login, getUserInfo, logout, getPermission } from '@/api/system'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import config from '@/config/settings'

const user = {
  namespaced: true,
  state: {
    token: '',
    name: '',
    userId: '',
    welcome: '',
    avatar: '',
    dataRangeType: '', // 用户区域级别 0中国 1省 2市 3区 4学校
    roles: {
      // 角色信息
      roleType: '', // 角色类型，10-总管理员，20-管理员，30-筛查员，40-年级主任，45-班主任
      roleTypeName: '' // 角色名称
    },
    orgInfo: {
      // 机构信息
      orgId: '', // 机构id
      orgType: '', // 机构大类型 10-学校 20-医院 30-政府部门 40-社会机构
      orgName: '', // 机构名称
      orgProperty: '', // 机构属性  10-独立学校 20-集团学校  30-独立医院 40-集团医院 45-独立社会机构，46-集团社会机构 50-教育局 55-卫健委
      areaIds: [], // 权限区域 //若果是只有省[provinceId,'',''] 市 [provinceId,cityId,''] 区[provinceId,cityId,regionId] 配合dataRangeType
      BelongArea: [] // 所属地区
    },
    permissions: [], // 权限资源id
    microApps: [] // 微服务
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      storage.set(ACCESS_TOKEN, token, config.tokenExpires)
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_RANGE_TYPE: (state, type) => {
      state.dataRangeType = type
    },
    SET_ORGINFO: (state, orgInfo) => {
      state.orgInfo = orgInfo
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            const token = response.data.token
            commit('SET_TOKEN', token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(async response => {
            const result = response.data

            !result?.userId && reject('获取用户信息失败，请重试！')
            console.log('用户信息:', result)

            // let { docName, userId, avatar, roles } = result
            const {
              roleType,
              roleTypeName,
              realName,
              userId,
              orgId,
              orgType,
              orgName,
              orgProperty,
              provinceId,
              cityId,
              regionId,
              dataRangeType,
              dataRangeProvinceId,
              dataRangeCityId,
              dataRangeRegionId
            } = result
            // 若果是学校地区权限id就是所属地区,政府为行政区域在后台机构管理关联地区
            const areaIds =
              dataRangeType == 4
                ? [provinceId, cityId, regionId]
                : [dataRangeProvinceId, dataRangeCityId, dataRangeRegionId]

            commit('SET_NAME', realName)
            commit('SET_USERID', userId)
            // commit('SET_AVATAR', avatar)
            commit('SET_ROLES', { roleType, roleTypeName })
            commit('SET_RANGE_TYPE', dataRangeType)
            commit('SET_ORGINFO', {
              orgId,
              orgType,
              orgName,
              orgProperty,
              areaIds,
              BelongArea: [provinceId, cityId, regionId]
            })

            try {
              await dispatch('GetPermissions')
            } catch {
              reject('获取用户权限失败，请重试！')
            }

            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户权限信息
    GetPermissions({ commit }) {
      return new Promise((resolve, reject) => {
        getPermission()
          .then(({ data }) => {
            commit('SET_PERMISSIONS', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state: { token } }) {
      return new Promise(resolve => {
        logout(token)
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
          .finally(() => {
            commit('SET_TOKEN', '')
            commit('SET_PERMISSIONS', [])
            commit('SET_ROLES', {})
            commit('SET_NAME', '')
            commit('SET_USERID', '')
            commit('SET_ORGINFO', {})

            commit('SET_ROUTERS', [], { root: true })
            storage.remove(ACCESS_TOKEN)
          })
      })
    },

    // 更新用户权限
    async UpdatePermissions({ dispatch, rootState: { permission } }) {
      try {
        // 获取用户权限
        await dispatch('GetPermissions')

        // 刷新路由
        resetRouter()

        // 获取可访问路由
        await dispatch('GenerateRoutes', {}, { root: true })

        // 注册路由
        router.addRoutes(permission.addRouters)
      } catch {
        // 获取权限失败时登出
        dispatch('Logout').then(() => {
          window.location.reload()
        })
      }
    }
  }
}

export default user
