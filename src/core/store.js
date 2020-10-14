const store = require('store')

/*
例：三秒钟过期时间
storage.set('xxx', '', new Date().getTime() + 3000)
*/
const plugins = [
  require('store/plugins/expire') // 有效存储时间支持
]

// 生成命名空间
const _namespacePrefix = 'student_health_platform'
const storage = store.namespace(_namespacePrefix)

storage.addPlugin(plugins)

export default storage
