const _key = '_version_'

export default {
  created() {
    process.env.VUE_APP_PREVIEW === 'false' &&
      setInterval(() => {
        // 版本检测 5分钟执行一次
        this.checkVersion()
      }, 3e5)
  },
  mounted() {
    // 系统初始化时更新版本
    process.env.VUE_APP_PREVIEW === 'false' && this.setLocalVersion()
  },
  methods: {
    getVersion() {
      return this.$axios.get('./version.json', {
        headers: { 'Cache-Control': 'no-cache' }
      })
    },
    async setLocalVersion() {
      const { data = {} } = await this.getVersion()
      this.$storage.set(_key, data.version)
    },
    async checkVersion() {
      const { data } = await this.getVersion()

      if (data.version !== this.$storage.get(_key)) {
        this.$storage.set(_key, data.version)
        this.openTips()
      }
    },
    openTips() {
      const key = `open${Date.now()}`
      const h = this.$createElement

      this.$notification.open({
        message: h('h3', '更新提示'),
        description: h('div', { style: { fontSize: '16px' } }, '系统发布了新的内容！'),
        placement: 'topRight',
        duration: null,
        btn: h(
          'a-button',
          {
            props: { type: 'primary' },
            on: {
              click: () => {
                this.$notification.close(key)
                window.location.reload()
              }
            }
          },
          '立即体验'
        ),
        key,
        onClose: () => {
          // window.location.reload()
        }
      })
    }
  }
}
