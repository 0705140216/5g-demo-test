<template>
  <a-modal v-bind="options" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="选择学生" prop="stuId">
          <a-select
            v-if="isAdd"
            v-model="form.stuId"
            show-search
            allow-clear
            option-label-prop="label"
            :default-active-first-option="false"
            :dropdown-match-select-width="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSearch"
            @change="handleChange"
          >
            <a-select-option v-for="_val in studentList" :key="_val.id" :label="_val.name" :value="_val.id">
              <ul class="drop-option">
                <li>{{ _val.name }}</li>
                <li>{{ _val.sex }}</li>
                <li>{{ _val.birth }}</li>
                <li>{{ _val.prefx }}-{{ _val.schoolYear }}-{{ _val.class }}</li>
              </ul>
            </a-select-option>
          </a-select>
          <span v-else>{{ form.name }}</span>
        </a-form-model-item>
        <a-form-model-item label="请假开始时间" prop="startTime">
          <span v-if="isView">{{ form.start }}</span>
          <a-date-picker
            v-else
            v-model="form.startTime"
            show-time
            value-format="YYYY-MM-DD HH"
            format="YYYY-MM-DD a"
            style="width: 100%;"
            placeholder="请选择开始时间"
            @ok="startOkHandle"
          />
        </a-form-model-item>
        <a-form-model-item label="请假结束时间" prop="endTime">
          <span v-if="isView">{{ form.end }}</span>
          <a-date-picker
            v-else
            v-model="form.endTime"
            show-time
            value-format="YYYY-MM-DD HH"
            format="YYYY-MM-DD a"
            style="width: 100%;"
            placeholder="请选择开始时间"
            @ok="endOkHandle"
          />
        </a-form-model-item>
        <a-form-model-item label="请假时长" prop="dateLength">
          <span>{{ form.dateLength }}天</span>
        </a-form-model-item>
        <a-form-model-item label="请假类型" prop="leaveType">
          <span v-if="isView">{{ form.leaveType === '1' ? '事假' : '病假' }}</span>
          <radio-select
            v-else
            v-model="form.leaveType"
            label-key="name"
            value-key="id"
            allow-clear
            :data="leaveTypeList"
          />
        </a-form-model-item>

        <a-form-model-item v-if="form.leaveType === '1'" label="请假原因" prop="leaveReason">
          <span v-if="isView">{{ form.leaveReason }}</span>
          <a-textarea
            v-else
            v-model.trim="form.leaveReason"
            placeholder="请填写请假原因"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :max-length="500"
            allow-clear
          />
        </a-form-model-item>
        <template v-else-if="form.leaveType === '2'">
          <a-form-model-item label="病因" prop="cause">
            <drop-selector v-model="form.cause" :disabled="isView" :data="causeList" placeholder="请选择病因" />
          </a-form-model-item>
          <a-form-model-item label="症状" prop="symptom">
            <span v-if="isView">{{ form.symptom }}</span>
            <a-textarea
              v-else
              v-model.trim="form.symptom"
              placeholder="请填写症状"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :max-length="500"
              allow-clear
            />
          </a-form-model-item>
        </template>
        <a-form-model-item label="附件">
          <!-- action="https://www.mocky.io/v2/5cc8019d300000980a055e76" -->
          <p v-if="isView && !fileList.length">暂无图片</p>
          <a-upload
            v-else
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :disabled="isView"
            @change="imageChange"
            @preview="handlePreview"
          >
            <div v-if="!isView && fileList.length < 8">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <!-- 图片预览 -->
    <img-view
      v-if="imgViewOpts.imgVisible"
      ref="imgView"
      :img-visible.sync="imgViewOpts.imgVisible"
      :view-src="imgViewOpts.viewSrc"
      @viewEmit="mediaSwitch"
    ></img-view>
    <template #footer>
      <a-button v-if="!isView" @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="submitLoading" :disabled="loading" @click="handleOk">
        {{ isView ? '确定' : '提交' }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { debounce } from '@/utils/util'
import modal from '@/mixins/modal'
import { rqb, rqc, rqbc } from '@/utils/formRules'
import { editTask } from '_api/template'
import ImgView from '_com/FilePreview/ImgView' // 图片预览

const rules = {
  stuId: { ...rqbc, message: '请选择学生' },
  startTime: { ...rqbc, message: '请选择开始时间' },
  endTime: { ...rqbc, message: '请选择结束时间' },
  leaveType: { ...rqc, message: '请选择请假类型' },
  leaveReason: { ...rqb, message: '请填写请假原因' },
  cause: { ...rqbc, message: '请选择病因' },
  symptom: { ...rqb, message: '请填写症状' }
}
const leaveTypeList = [
  { id: '1', name: '事假' },
  { id: '2', name: '病假' }
]
const causeList = [
  { id: '', name: '请选择' },
  { id: '1', name: '感冒' },
  { id: '2', name: '气管炎、肺炎' },
  { id: '3', name: '胃肠道疾病' },
  { id: '4', name: '心脏病' },
  { id: '5', name: '眼病' },
  { id: '6', name: '牙病' },
  { id: '7', name: '耳鼻喉疾病' },
  { id: '8', name: '泌尿科疾病' },
  { id: '9', name: '神经衰弱' },
  { id: '10', name: '意外伤害' },
  { id: '11', name: '结核' },
  { id: '12', name: '肺炎' },
  { id: '13', name: '其他传染病' },
  { id: '14', name: '病因不明' },
  { id: '15', name: '心理问题' },
  { id: '16', name: '其他' }
]

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
const studentData = [
  {
    id: '1',
    name: '王晓峰',
    sex: '男',
    birth: '2001-12-12',
    prefx: '小学',
    schoolYear: '2019',
    class: '01'
  }
]
export default {
  name: 'AddLeaveModal',
  components: { ImgView },
  mixins: [modal],
  data() {
    this.leaveTypeList = leaveTypeList
    this.causeList = causeList
    this.studentData = studentData
    return {
      submitLoading: false,
      form: { stuId: undefined, dateLength: '0.5' },
      stuId: '',
      studentList: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      picIndex: 0,
      imgViewOpts: {
        // 预览图片
        viewSrc: '',
        imgVisible: false
      }
    }
  },
  computed: {
    isAdd() {
      return this.record.status === 0
    },
    isEdit() {
      return this.record.status === 1
    },
    isView() {
      return this.record.status === 2
    },
    rules() {
      return this.isView ? {} : rules
    }
  },
  created() {
    this.validate = debounce(this.validate)
    this.studentList = this.studentData
    !this.isAdd && (this.form = this.record.info)
    if (this.isEdit) {
      this.form.startTime = this.dateInit(this.form.start)
      this.form.endTime = this.dateInit(this.form.end)
    }
    console.log(this.record)
  },
  methods: {
    dateInit(date) {
      let arr = date.split(' ')
      if (arr[1] === '上午') arr[1] = arr[1] === '上午' ? '9' : '14'
      return arr.join(' ')
    },
    startOkHandle(date) {
      this.form.start = moment(date).format('YYYY-MM-DD a')
    },
    endOkHandle(date) {
      this.form.end = moment(date).format('YYYY-MM-DD a')
    },
    handleSearch(value) {
      setTimeout(() => {
        this.studentList = this.studentData.map(_item => {
          if (_item.name.indexOf(value) > -1) {
            return _item
          }
        })
        console.log(this.studentList)
      }, 300)
    },
    handleChange(value) {
      console.log(value)
      // this.value = value
    },
    previewCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.imgViewOpts.imgVisible = true
      this.imgViewOpts.viewSrc = file.url || file.preview
      this.$nextTick(() => {
        this.$refs.imgView.init() // 渲染图片
      })
    },
    imageChange({ fileList }) {
      this.fileList = fileList
      console.log(fileList)
    },
    beforeUpload(file) {
      console.log('aaa')
      this.fileList = [...this.fileList, file]
      return false
    },
    handleOk() {
      this.isView ? this.handleCancel() : this.validate()
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
      console.log('提交', this.form)
      setTimeout(() => {
        this.$message.success('提交成功')
        this.$emit('on-submit-success', this.form)
        this.handleCancel()
      }, 2000)

      // editTask(form)
      //   .then(() => {
      //     this.$message.success('提交成功')
      //     this.$emit('on-submit-success')
      //     this.handleCancel()
      //   })
      //   .finally(() => {
      //     this.submitLoading = false
      //   })
    },
    // 图片上下
    async mediaSwitch(isDown) {
      if (isDown) {
        this.picIndex = this.picIndex + 1 >= this.fileList.length ? 0 : this.picIndex + 1
      } else {
        this.picIndex = this.picIndex <= 0 ? this.fileList.length - 1 : this.picIndex - 1
      }
      let file = this.fileList.find((item, index) => index == this.picIndex)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.imgViewOpts.viewSrc = file.url || file.preview
      this.$nextTick(() => {
        this.$refs.imgView.init() // 渲染图片
      })
    }
  }
}
</script>
<style lang="less" scoped>
.drop-option {
  display: flex;
  li {
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 50px;
    flex-grow: 2;
    &:first-child {
      flex-grow: 1;
      width: 80px;
    }
    &:nth-child(3),
    &:nth-child(4) {
      flex-grow: 1;
      width: 90px;
    }
  }
}
</style>
