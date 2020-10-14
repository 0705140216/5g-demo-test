import store from '@/store'

let STORE = {}
let setState

const appStore = props => {
  const {
    store: { getters }
  } = props

  // 同步用户信息
  store.commit('user/SET_TOKEN', getters.token)

  STORE = props
  setState = props.setGlobalState
}

export { STORE, setState }

export default appStore
