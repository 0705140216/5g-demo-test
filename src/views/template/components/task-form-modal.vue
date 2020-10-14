<template>
  <a-modal v-bind="options" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="任务名称" prop="taskName">
          <a-input v-if="isEdit" v-model.trim="form.taskName" placeholder="请输入任务名称" />
          <span v-else>{{ form.taskName }}</span>
        </a-form-model-item>

        <a-form-model-item label="开始时间" prop="startTime">
          <a-date-picker
            v-if="isEdit"
            v-model="form.startTime"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%;"
            placeholder="请选择开始时间"
          />
          <span v-else>{{ form.startTime }}</span>
        </a-form-model-item>

        <a-form-model-item label="任务负责人" prop="principal">
          <drop-selector
            v-if="isEdit"
            v-model="form.principal"
            :data="[
              { id: 0, name: '付晓晓' },
              { id: 1, name: '周毛毛' }
            ]"
            placeholder="请选择负责人"
          />
          <span v-else>{{ form.principal }}</span>
        </a-form-model-item>

        <a-form-model-item label="产品描述" prop="description">
          <a-textarea v-if="isEdit" v-model.trim="form.description" placeholder="请输入产品描述"></a-textarea>
          <span v-else>{{ form.description }}</span>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <template #footer>
      <a-button v-if="isEdit" @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="submitLoading" :disabled="loading" @click="handleOk">
        {{ isEdit ? '提交' : '确定' }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { debounce } from '@/utils/util'
import modal from '@/mixins/modal'
import { rqb, rqc } from '@/utils/formRules'
import { editTask } from '_api/template'

const rules = {
  taskName: { ...rqb, message: '任务名称' },
  startTime: { ...rqc, message: '请选择开始时间' },
  principal: { ...rqc, message: '请选择负责人' },
  description: { ...rqb, message: '请输入描述' }
}

export default {
  name: 'TaskFormModal',
  mixins: [modal],
  data() {
    return {
      submitLoading: false,
      form: {}
    }
  },
  computed: {
    isEdit() {
      return this.record.status === 1
    },
    rules() {
      return this.isEdit ? rules : {}
    }
  },
  created() {
    this.validate = debounce(this.validate)
  },
  methods: {
    handleOk() {
      this.isEdit ? this.validate() : this.handleCancel()
    },
    validate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {}
          this.submit(params)
        }
      })
    },
    submit(form) {
      this.submitLoading = true

      editTask(form)
        .then(() => {
          this.$message.success('提交成功')
          this.$emit('on-submit-success')
          this.handleCancel()
        })
        .finally(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
