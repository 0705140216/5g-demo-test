<template>
  <a-modal v-bind="options" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <p v-if="type === 2">是否撤销 {{ nameArr.length > 3 ? `${nameArr.length}人` : nameArr.join(',') }} 的请假审批</p>
      <a-form-model v-else-if="type === 1" ref="form" layout="vertical" :model="form">
        <a-form-model-item
          :label="`是否通过 ${nameArr.length > 3 ? `${nameArr.length}人` : nameArr.join(',')} 的请假审批`"
        >
          <radio-select v-model="form.flag" label-key="name" value-key="id" allow-clear :data="flagList"></radio-select>
        </a-form-model-item>

        <a-form-model-item v-if="form.flag === 0" label="拒绝原因">
          <a-textarea
            v-model.trim="form.desc"
            placeholder="请填写拒绝原因"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :max-length="500"
            allow-clear
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="confirmLoading" :disabled="btnDisabled" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
// import { debounce } from '@/utils/util'
import newModel from '@/mixins/newModel'

export default {
  name: 'ApproveModel',
  mixins: [newModel],
  data() {
    return {
      flagList: [
        { id: 1, name: '通过' },
        { id: 0, name: '拒绝' }
      ],
      form: { flag: '', desc: '' },
      nameArr: []
    }
  },
  computed: {
    type() {
      // 1 审批  2 撤销
      return this.record.type
    },
    btnDisabled() {
      return this.type === 1 && (this.form.flag === '' || (this.form.flag === 0 && this.form.desc.length < 2))
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.nameArr = this.record.list.map(item => {
        return item.name
      })
    },
    handleOk() {
      this.submit()
    },

    async submit() {
      this.confirmLoading = true
      console.log(this.type === 1 ? '审批' : '撤销', this.form)
      setTimeout(() => {
        this.$message.success('操作成功')
        this.$emit('on-submit-success')
        this.handleCancel()
      }, 2000)
      // 当有两个接口时
      // try {
      //   // this.isEdit ? await this.apiEdit(params) : await this.apiAdd(params)
      //   this.confirmLoading = false
      //   this.$message.success('操作成功')
      //   this.$emit('on-submit-success')
      //   this.handleCancel()
      // } catch {
      //   this.confirmLoading = false // 有报错逻辑在这里处理
      // } finally {
      //   this.confirmLoading = false // 统一关掉loading
      // }
      // ----------------当只有一个接口时 async不加-------------------
      // insertOrUpdateDoctor(params)
      //   .then(() => {
      //     this.$message.success('操作成功')
      //     this.$emit('on-submit-success')
      //     this.handleCancel()
      //   })
      //   .finally(() => {
      //     this.confirmLoading = false
      //   })
    }
  }
}
</script>
