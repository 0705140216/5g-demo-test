const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  userId: state => state.user.userId,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  permissions: state => state.user.permissions
}

export default getters
