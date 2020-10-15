<template>
  <div>
    <a-card :bordered="false" class="table-container">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="操做类型" prop="sex">
          <radio-select v-model="form.type" label-key="name" value-key="id" allow-clear :data="typeList"></radio-select>
        </a-form-model-item>

        <div v-if="form.type == 0">
          <a-form-model-item label="处方类型" prop="category">
            <radio-select
              v-model="form.category"
              label-key="name"
              value-key="id"
              allow-clear
              :data="categoryList"
            ></radio-select>
          </a-form-model-item>

          <a-form-model-item label="诊断ID" prop="diagnoseId">
            <a-input v-if="!isView" v-model.trim="form.diagnoseId" allow-clear placeholder="请输入诊断ID" />
            <span v-else>{{ form.name }}</span>
          </a-form-model-item>

          <a-form-model-item label="医院名称" prop="hospitalCode">
            <remote-select
              ref="remoteHos"
              v-model="form.hospitalCode"
              :list-api="hosName"
              placeholder="请输入医院名称"
              key-word="name"
            ></remote-select>
          </a-form-model-item>

          <a-form-model-item label="医生列表" prop="doctorCode">
            <remote-select
              ref="remoteDoc"
              v-model="form.doctorCode"
              :list-api="hosName"
              placeholder="请输入医生列表"
              key-word="name"
            ></remote-select>
          </a-form-model-item>
        </div>

        <!--        撤销处方-->
        <div v-else>
          <a-form-model-item label="院方处方编号" prop="onlyId">
            <a-input v-model.trim="form.onlyId" allow-clear placeholder="请输入院方处方编号" />
          </a-form-model-item>

          <a-form-model-item label="医院名称" prop="hospitalCode">
            <remote-select
              ref="remoteDieaseHos"
              v-model="form.hospitalCode"
              :list-api="queryHospital"
              placeholder="请输入医院名称"
              key-word="name"
            ></remote-select>
          </a-form-model-item>
        </div>

        <a-form-model-item label=" ">
          <a-button type="primary" :loading="confirmLoading" @click="handleOk">
            提交
          </a-button>
        </a-form-model-item>
      </a-form-model>

      <!--      提交-->
    </a-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      confirmLoading: false,
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
      form: {
        type: 0,
        category: 1
      },
      typeList: [
        { id: 0, name: '开处方' },
        { id: 1, name: '撤销处方' }
      ],
      categoryList: [
        { id: 1, name: '西药' },
        { id: 2, name: '中药' }
      ],
      hosName: () => {}
    }
  },
  computed: {},
  created() {},
  methods: {
    handleOk() {}
  }
}
</script>

<style lang="less" scoped></style>
