<template>
  <a-modal dialog-class="stu-details-modal" v-bind="options" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model class="isView" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="姓名">
          <span>{{ form.stuName }}</span>
        </a-form-model-item>

        <a-form-model-item label="性别">
          <span>{{ form.sex | getSex }}</span>
        </a-form-model-item>

        <a-form-model-item label="出生日期">
          <span>{{ form.birth }}</span>
        </a-form-model-item>

        <a-form-model-item label="学段">
          <span>{{ form.period }}</span>
        </a-form-model-item>

        <a-form-model-item label="学年">
          <span>{{ form.schoolYear }}</span>
        </a-form-model-item>

        <a-form-model-item label="班级">
          <span>{{ form.class }}</span>
        </a-form-model-item>

        <a-form-model-item label="请假开始时间">
          <span>{{ form.startTime }}</span>
        </a-form-model-item>

        <a-form-model-item label="请假结束时间">
          <span>{{ form.endTime }}</span>
        </a-form-model-item>

        <a-form-model-item label="请假时长">
          <span>{{ form.durationLeave }}</span>
        </a-form-model-item>

        <a-form-model-item label="请假原因">
          <span>{{ form.reasonLeave }}</span>
        </a-form-model-item>

        <a-form-model-item label="附件">
          <a-upload
            accept=".png, .jpg, .pdf, .tif, .jpeg, .JPG, .JPEG, .PNG"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            :file-list="form.diagnosisTreat"
            :multiple="true"
            @preview="handlePreview"
          ></a-upload>
        </a-form-model-item>

        <a-form-model-item label="创建人">
          <span>{{ form.revocator }}</span>
        </a-form-model-item>

        <a-form-model-item label="创建时间">
          <span>{{ form.revokeTime }}</span>
        </a-form-model-item>

        <a-form-model-item label="审批状态">
          <span>{{ form.auditStatus | auditStatus }}</span>
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
      <a-button type="primary" :disabled="loading" @click="handleCancel">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import newModel from '@/mixins/newModel'
import { ImgView } from '_com' // 图片预览

export default {
  name: 'IllLeaveStuDetailsModal',
  components: {
    ImgView
  },
  mixins: [newModel],
  data() {
    return {
      form: {},
      picIndex: 0, // 初始图片角标
      imgViewOpts: {
        // 预览图片
        viewSrc: '',
        imgVisible: false
      }
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    // 初始化数据
    getInit() {
      this.form = Object.assign({}, this.form, this.record)
    },
    handlePreview(file) {
      this.imgViewOpts.imgVisible = true
      this.imgViewOpts.viewSrc = file.url
      this.$nextTick(() => {
        this.$refs.imgView.init() // 渲染图片
      })
    },
    // 图片上下
    mediaSwitch(isDown) {
      if (isDown) {
        this.picIndex = this.picIndex + 1 >= this.form.diagnosisTreat.length ? 0 : this.picIndex + 1
      } else {
        this.picIndex = this.picIndex <= 0 ? this.form.diagnosisTreat.length - 1 : this.picIndex - 1
      }
      const src = this.form.diagnosisTreat.find((item, index) => index == this.picIndex).url
      this.imgViewOpts.viewSrc = src
      this.$nextTick(() => {
        this.$refs.imgView.init() // 渲染图片
      })
    }
  }
}
</script>

<style lang="less" scoped>
.isView {
  .ant-form-item {
    .marginB(0);
  }
}
/deep/ .stu-details-modal {
  .ant-modal-body {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
