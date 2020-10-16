<template>
  <div>
    <a-card :bordered="false" class="table-container">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="操做类型">
          <radio-select
            v-model="form.type"
            label-key="name"
            value-key="id"
            allow-clear
            :data="typeList"
            @change="changeRadio"
          ></radio-select>
        </a-form-model-item>

        <a-form-model-item v-if="form.type == 0" label="处方类型" prop="category">
          <radio-select
            v-model="form.category"
            label-key="name"
            value-key="id"
            allow-clear
            :data="categoryList"
          ></radio-select>
        </a-form-model-item>

        <a-form-model-item label="诊断ID" prop="diagnoseId">
          <a-input v-model.trim="form.diagnoseId" allow-clear placeholder="请输入诊断ID" @change="handleChangeDiag" />
        </a-form-model-item>

        <a-form-model-item v-if="form.type == 1" label="院方处方编号" prop="onlyId">
          <drop-selector
            v-model="form.onlyId"
            allow-clear
            :data="onlyIdList"
            placeholder="请选择院方处方编号"
          ></drop-selector>
        </a-form-model-item>

        <a-form-model-item label="医院名称" prop="hospitalId">
          <remote-select
            ref="remoteHos"
            v-model="form.hospitalId"
            :list-api="queryHospital"
            value-key="hospitalId"
            placeholder="请输入医院名称"
            :query="hosQuery"
            key-word="name"
            :init-data="false"
            @change="handleChangeHos"
          ></remote-select>
        </a-form-model-item>

        <div v-if="form.type == 0">
          <a-form-model-item label="医生列表" prop="doctorCode">
            <remote-select
              ref="remoteDoc"
              v-model="form.doctorCode"
              :list-api="queryDoctor"
              placeholder="请输入医生列表"
              :query="docQuery"
              :init-data="false"
              value-key="doctorCode"
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
import { queryHospital, queryDoctor, queryPre, createPrescription, cancelPrescription } from '_api/home'
import { rqb, rqc } from '@/utils/formRules'
export default {
  components: {},
  data() {
    this.queryHospital = queryHospital
    this.queryDoctor = queryDoctor
    return {
      confirmLoading: false,
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
      form: {
        diagnoseId: '',
        type: 0,
        category: 1,
        onlyId: undefined,
        hospitalId: undefined,
        doctorCode: undefined
      },
      onlyIdList: [],
      rules: {
        diagnoseId: { ...rqb, message: '请输入诊断Id' },
        onlyId: { ...rqc, message: '请选择院方处方编号' },
        hospitalId: { ...rqc, message: '请选择医院' },
        doctorCode: { ...rqc, message: '请选择医生' }
      },
      typeList: [
        { id: 0, name: '开处方' },
        { id: 1, name: '撤销处方' }
      ],
      categoryList: [
        { id: 1, name: '西药' },
        { id: 2, name: '中药' }
      ]
    }
  },
  computed: {
    hosQuery() {
      return {
        diagnoseId: this.form.diagnoseId
      }
    },
    docQuery() {
      return {
        hospitalId: this.form.hospitalId
      }
    }
  },
  created() {},
  methods: {
    changeRadio() {
      this.$refs.form.clearValidate()
      this.form.type && this.getQueryPre(this.form.diagnoseId)
    },
    /**
     * 诊断id失去焦点
     */
    handleChangeDiag() {
      this.$set(this.form, 'onlyId', undefined)
      this.$set(this.form, 'hospitalId', undefined)
      this.$set(this.form, 'doctorCode', undefined)
      this.form.type && this.getQueryPre(this.form.diagnoseId)
      this.handleGetHos()
    },
    /**
     * 获取处方编号列表
     */
    getQueryPre(diagnoseId) {
      if (!diagnoseId) {
        this.$message.error('请输入诊断ID')
        return
      }
      queryPre({ diagnoseId }).then(({ data }) => {
        this.onlyIdList = data.map(i => {
          return { id: i.onlyId, name: i.onlyId }
        })
      })
    },
    /**
     * 改变医院列表,获取医生列表
     */
    handleGetHos() {
      this.$set(this.form, 'hospitalId', undefined)
      this.$nextTick(() => {
        this.$refs.remoteHos.getSearchList()
      })
    },
    /**
     * 改变医院列表,获取医生列表
     */
    handleChangeHos() {
      this.$set(this.form, 'doctorCode', undefined)
      this.$nextTick(() => {
        this.$refs.remoteDoc.searchList = []
        this.form.hospitalId && this.$refs.remoteDoc.getSearchList()
      })
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let { diagnoseId, type, category, onlyId, hospitalId, doctorCode } = this.form
          let hospitalCode = this.$refs.remoteHos.searchList.find(i => i.hospitalId == hospitalId)?.hospitalCode
          let params
          if (type == 0) {
            // 开处方
            params = {
              diagnoseId,
              category,
              hospitalCode,
              doctorCode
            }
          } else {
            // 撤销处方
            params = {
              onlyId,
              hospitalCode
            }
          }
          this.submit(params, type)
        }
      })
    },
    async submit(params, type) {
      this.confirmLoading = true
      try {
        type ? await cancelPrescription(params) : await createPrescription(params)
        this.$message.success('操作成功')
      } finally {
        this.confirmLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
