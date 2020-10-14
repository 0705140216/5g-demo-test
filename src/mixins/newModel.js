export default {
  props: {
    status: {
      type: Number,
      default: 0
    },
    // 携带参数
    record: {
      type: Object,
      default: null
    },
    // 配置
    settings: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    options() {
      return {
        title: '弹窗',
        width: 600,
        centered: true,
        maskClosable: false,
        destroyOnClose: true, // 自动清空状态

        ...this.$attrs,
        ...this.settings
      }
    }
  },
  data() {
    return {
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
      confirmLoading: false,
      loading: false
    }
  },
  created() {},
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
