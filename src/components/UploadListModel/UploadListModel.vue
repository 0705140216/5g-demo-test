<template>
  <a-modal :mask-closable="false" v-bind="options" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model
        ref="formData"
        :model="formData"
        :rules="formRules"
        label-position="left"
        :label-col="{ xs: { span: 24 }, sm: { span: 4 } }"
        :wrapper-col="{ xs: { span: 24 }, sm: { span: 19 } }"
      >
        <div class="each-group">
          <a-form-model-item prop="schoolName" label="学校名称">
            <!--对于独立学校，改选项只读-->
            <remote-select
              v-if="!record.orgId"
              ref="orgSelect"
              v-model="formData.schoolName"
              placeholder="输入学校名称查询选择"
              :list-api="schoolListApi"
              value-key="orgId"
              label-key="orgName"
              :query="query"
              @changeInfo="schoolChange"
            />
            <span v-else>{{ formData.schoolName }}</span>
          </a-form-model-item>
          <!--修改 V3.0 start-->

          <!--针对班主任导入学生名单，需判断-->
          <a-form-model-item v-if="formData.className" prop="classId" label="班级">
            <span>
              {{ formData.prefxName }} - {{ formData.classYear }} - {{ formData.className }}班
              <i v-if="formData.alias" class="fs-normal">（{{ formData.alias }}）</i>
            </span>
          </a-form-model-item>
          <a-form-model-item v-else prop="prefx" label="学段">
            <drop-selector
              v-model="formData.prefx"
              placeholder="选择学段"
              style="width: 200px;"
              :data="schoolTypeList"
              value-key="prefix"
              label-key="prefixName"
            />
          </a-form-model-item>
          <a-form-model-item prop="stuType" label="学生类型">
            <a-radio-group v-model="formData.stuType">
              <!--内地有身份证权限无需控制，默认都有-->
              <a-radio v-for="item in templateList" :key="item.type" :value="item.type">
                {{ $g.expStuType[item.type] }}
              </a-radio>
            </a-radio-group>
            <p>
              <a :download="downName" :href="downUrl" class="tem-text">下载{{ downLabel }}学生名单模板</a>
            </p>
          </a-form-model-item>
          <a-form-model-item prop="file" label="学生名单">
            <div class="upload-part">
              <!-- <file-upload
                ref="upload"
                v-bind="uploadOpts"
                @change="uploadChange"
                @success="uploadSuccess"
                @error="uploadFail"
              /> -->
            </div>
          </a-form-model-item>
          <!--修改 V3.0 end-->
          <div class="import-tip">
            <div>温馨提示</div>
            <div>
              <p>1、可分批次导入学生信息</p>
              <p>
                2、如有同一个学生信息被导入两次，第二次会覆盖第一次导入的学生信息（如：小明同学的信息被导入了两次，那么第二次导入的小明的身份信息会覆盖第一次导入的信息）
              </p>
              <!-- <p>3、新导入的学生不会同步到任务中，需要在“筛查”任务中手动操作“同步筛查名单”</p> -->
              <p>3、不同学段的学生名单必须分开导入（如小学和初中的学生名单不可一起导入）</p>
            </div>
          </div>
        </div>
      </a-form-model>
    </a-spin>

    <span slot="footer" class="dialog-footer">
      <a-button @click="handleCancel">取 消</a-button>
      <a-button type="primary" :disabled="loading" :loading="btnLoading" @click="submitAction">确 定</a-button>
    </span>
    <upload-result-model
      v-if="resultOpts"
      ref="result"
      v-bind="resultOpts"
      @close="resultOpts.visible = false"
      @close-parent="closeAll"
    />
  </a-modal>
</template>

<script>
import UploadResultModel from '../UploadResultModel'
import { getSchoolList, prefixListByOrgId, checkPlanStatus, uploadStuInfo, getExcelList } from '_api/template'

import newModel from '@/mixins/newModel'
import { rqc, rqb } from '@/utils/formRules'
import { debounce } from '@/utils/util'

export default {
  name: 'UploadListModel',
  components: { UploadResultModel },
  mixins: [newModel],
  props: {},
  data() {
    const checkOrgHasTask = (rule, val, callback) => {
      const { orgId } = this.formData
      checkPlanStatus(orgId)
        .then(res => {
          res.data ? callback() : callback(new Error('该机构所在筛查计划未完成，不可导入学生名单'))
        })
        .catch(err => {
          err && callback(new Error(err))
        })
    }
    return {
      btnLoading: false,
      formData: {
        orgId: '',
        schoolName: '',
        prefx: undefined,
        stuType: 1,
        file: []
      },
      formRules: {
        schoolName: [
          { ...rqb, message: '请选择学校' },
          { validator: checkOrgHasTask, trigger: ['change', 'blur'] }
        ],
        prefx: [{ ...rqc, message: '请选择学段' }],
        file: [{ ...rqc, message: '请上传学生名单文件' }]
      },
      query: {
        // 获取学校列表格外参数
        id: this.$store.state.user.orgInfo.orgId,
        pageNum: 1,
        pageSize: 10
      },
      schoolListApi: getSchoolList,
      schoolTypeList: [], // 学段类型
      uploadOpts: {
        btnName: '学生名单',
        accept: '.xlsx,.xls',
        data: {}, // 接口额外参数
        drag: true, // 新增 V3.0
        action: process.env.VUE_APP_API_BASE_URL + uploadStuInfo // 接口地址
      },
      resultOpts: {
        visible: false,
        title: '导入结果',
        width: '620px',
        record: {}
      },
      templateList: [] // excel模板列表
    }
  },
  computed: {
    downName() {
      const { name } = this.templateList.find(item => item.type === this.formData.stuType) || {}
      return name
    },
    downUrl() {
      const { downloadUrl } = this.templateList.find(item => item.type === this.formData.stuType) || {}
      return downloadUrl
    },
    downLabel() {
      return this.$g.expStuType[this.formData.stuType]
    }
  },
  created() {
    this.formData = { ...this.formData, ...this.record }

    let { orgId } = this.record
    orgId && this.getSchoolType(orgId)
    orgId && this.getDowloadList(orgId)
    this.submitAction = debounce(this.submitAction)
  },
  mounted() {
    let { orgId } = this.record
    !orgId && this.setInitOrg()
  },
  methods: {
    async setInitOrg() {
      await this.$nextTick()
      this.$refs.orgSelect.getSearchList(this.formData.schoolName)
    },
    schoolChange({ orgId }) {
      this.formData.orgId = orgId
      this.getSchoolType(orgId)
    },
    // 获取学段
    async getSchoolType(orgId) {
      const { data } = await prefixListByOrgId(orgId)
      this.schoolTypeList = data
    },
    // 获取当前机构可下载模板列表
    async getDowloadList(orgId) {
      // const { data } = await getExcelList({ orgId })
      this.templateList = this.$g.stuType
    },
    submitAction() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.uploadOpts.data = {
            orgId: this.formData.orgId,
            stuType: this.formData.stuType,
            prefx: this.formData.prefx,
            classYear: this.formData.classYear || '',
            classId: this.formData.classId || '',
            taskId: this.formData.taskId || '',
            planType: this.formData.planType || ''
          }
          this.$nextTick(() => {
            this.btnLoading = true
            this.$refs.upload.submit()
            this.resultOpts.visible = true
          })
        }
      })
    },
    uploadChange(files) {
      this.formData.file = files
      this.$refs.formData.validateField('file')
    },
    // 服务器上传成功
    uploadSuccess(data) {
      this.btnLoading = false
      this.resultOpts.record = data
    },
    // 服务器上传失败
    uploadFail() {
      this.btnLoading = false
      this.resultOpts.visible = false
    },
    // 关闭全部
    closeAll() {
      this.handleCancel()
      this.$emit('on-submit-success')
    }
  }
}
</script>

<style lang="less" scoped>
p {
  margin-bottom: 0;
}
.upload-btn {
  display: inline-block;
  margin-right: 50px;
}
.upload-part {
  display: flex;
}
.tem-text {
  color: @light-blue;
  text-decoration: underline;
  height: 25px;
}
.import-tip {
  display: flex;
  line-height: 25px;
  color: #333;
  & > div {
    &:first-child {
      width: 90px;
    }
    &:last-child {
      flex: 1;
      p {
        padding-bottom: 10px;
        color: @light-blue;
      }
    }
  }
}
</style>
