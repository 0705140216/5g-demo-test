import { userDataRange } from '_api/system'
import { regionTree } from '_api/common'
import { getFirstItem } from '@/utils/tools'

const socket = {
  namespaced: true,
  state: {
    areaOptions: [], // 权限地区
    defaultArea: [],
    allArea: [] // 所有地区
  },

  mutations: {
    // 设置选中的数据
    SET_AREA_OPTIONS(state, areaOptions) {
      state.areaOptions = areaOptions
    },
    SET_DEFAULT_AREALIST(state, data) {
      let areaArray = getFirstItem(data)
      state.defaultArea = areaArray
    },
    SET_ALL_AREA(state, data) {
      // 获取所有地区
      state.allArea = data
    }
  },

  actions: {
    UserDataRange({ commit }, params) {
      return new Promise((resolve, reject) => {
        userDataRange(params).then(({ data }) => {
          commit('SET_AREA_OPTIONS', data)
          commit('SET_DEFAULT_AREALIST', data)
          resolve(data)
        })
      }).catch(err => {
        reject(err)
      })
    },
    GETALLAREADATA({ commit, state }) {
      return new Promise(resolve => {
        if (state.allArea && state.allArea.length) {
          resolve(state.allArea)
        } else {
          regionTree().then(({ data }) => {
            commit('SET_ALL_AREA', data)
            resolve(data)
          })
        }
      })
    }
  }
}

export default socket
