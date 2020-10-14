import Vue from 'vue'

export default {
  props: {
    // 弹框可编辑标识 可优化查看类弹框加载性能
    editAble: {
      type: Boolean,
      default: true
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 参数
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
        width: 500,
        centered: true,
        maskClosable: false,
        destroyOnClose: true, // 自动清空状态

        ...this.$attrs,
        ...this.settings
      }
    }
  },
  watch: {
    record: {
      handler(data) {
        let formData = Object.assign({}, this.form, data)
        // 针对查看类型弹窗 无须数据监听
        // https://cn.vuejs.org/v2/api/#Vue-observable
        this.form = this.editAble ? Vue.observable(formData) : formData
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
      this.editAble && this.$refs.form?.resetFields() // 表单 重置
    }
  }
}
