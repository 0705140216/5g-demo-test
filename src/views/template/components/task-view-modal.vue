<template>
  <a-modal v-bind="options" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="任务名称">
          <span>{{ form.taskName }}</span>
        </a-form-model-item>

        <a-form-model-item label="开始时间">
          <span>{{ form.startTime }}</span>
        </a-form-model-item>

        <a-form-model-item label="任务负责人">
          <span>{{ form.principal }}</span>
        </a-form-model-item>

        <a-form-model-item label="产品描述">
          <span>{{ form.description }}</span>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <template #footer>
      <a-button type="primary" :disabled="loading" @click="handleCancel">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import modal from '@/mixins/modal'

export default {
  name: 'TaskViewModal',
  mixins: [modal],
  data() {
    return {
      form: {}
    }
  },
  methods: {}
}
</script>
