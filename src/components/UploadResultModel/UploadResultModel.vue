<template>
  <a-modal
    :custom-class="loading ? 'bg-grey' : ''"
    :mask-closable="false"
    :closable="!loading"
    v-bind="$attrs"
    @close="submitAction"
  >
    <template v-if="!loading">
      <p class="success-tip">
        成功
        <span class="big">{{ row.isDivideClass ? '分班' : '导入' }}</span>
        <span class="num">{{ row.studentSize }}</span>
        名学生，其中新增学生
        <span class="num">{{ row.insertCount }}</span>
        名，修改学生
        <span class="num">{{ row.updateCount }}</span>
        名
      </p>
      <p v-show="tableData.length" class="success-tip">
        <span class="num">{{ tableData.length }}</span>
        名学生{{ row.isDivideClass ? '分班' : '数据导入' }}失败
        <span v-show="row.stuUnCoverSize">
          ，其中
          <i class="num" style="font-style: normal;">{{ row.stuUnCoverSize }}</i>
          名学生因有筛查记录，不可覆盖
        </span>
      </p>
      <template v-if="row.repeatIdcardSet.length">
        <p class="err-tip">
          学生名单中含以下
          <span class="num">身份证号重复</span>
          ，请核对修正后
          <span class="num">重新导入</span>
        </p>
        <div style="max-height: 200px; line-height: 1.5;">
          <p v-for="item in row.repeatIdcardSet" :key="item">{{ item }}</p>
        </div>
      </template>
      <template v-if="row.repeatNameSexBirthSet.length">
        <p class="err-tip">
          学生名单中含以下
          <span class="num">姓名+性别+出生日期重复</span>
          ，请核对修正后
          <span class="num">重新导入</span>
        </p>
        <div style="max-height: 200px; line-height: 1.5;">
          <p v-for="item in row.repeatNameSexBirthSet" :key="item">{{ item }}</p>
        </div>
      </template>

      <template v-if="tableData.length">
        <a-button type="primary" @click="row.errorExcelDownloadUrl && downExcel(row.errorExcelDownloadUrl)">
          点击下载错误数据
        </a-button>
        <p class="err-tip">以下为表格错误数据，请修改后导入：</p>
        <el-table :data="tableData" border style="width: 100%;">
          <el-table-column prop="rowNum" label="行数" width="180">
            <template #default="scope">
              <p class="row-tip">
                第【
                <span class="num">{{ scope.row.rowNum }}</span>
                】行
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="errMsg" label="错误内容" />
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <!--<a-button @click="$emit('close')">取 消</a-button>-->
        <a-button type="primary" @click="submitAction">确 定</a-button>
      </span>
    </template>
    <div v-else class="loading-tip">
      <p><img src="@/assets/images/upload.gif" alt="" /></p>
      <p>数据极速检测中，请等待....</p>
    </div>
    <!--同步筛查名单选择任务提示-->
    <sync-tip-model v-if="syncOpts.visible" append-to-body v-bind="syncOpts" @close="syncOpts.visible = false" />
  </a-modal>
</template>

<script>
export default {
  name: 'UploadResultModel',
  props: {
    row: {
      // 上传成功后返回的数据
      type: Object,
      default: () => {
        return {
          studentSize: 0,
          stuMSize: 0,
          stuFSize: 0,
          stuFailInfoList: '',
          repeatIdcardSet: [],
          repeatNameSexBirthSet: [],
          stuUnCoverSize: 0,
          taskSimpleVOS: '',
          insertCount: 0,
          updateCount: 0,
          isDivideClass: false // 是否分班
        }
      }
    }
  },
  data() {
    return {
      loading: true,
      tableData: [],
      syncOpts: {
        // 同步名单信息
        visible: false,
        title: '学生基础信息同步提示',
        width: '620px',
        row: {}
      }
    }
  },
  watch: {
    row(newVal) {
      const { stuFailInfoList, taskSimpleVOS: taskList, studentIdList: stuIds } = newVal
      stuFailInfoList && this.handleData(stuFailInfoList)
      taskList &&
        taskList.length &&
        setTimeout(() => {
          this.showSyncModel({ taskList, stuIds })
        }, 300)
    }
  },
  methods: {
    downExcel(url) {
      window.open(url, '_blank')
    },
    // 数据处理
    handleData(arr) {
      this.loading = true
      let dataArr = []
      if (arr.length > 0) {
        arr.forEach(item => {
          let errMsg = ''
          let newArr = []
          item.forEach(subItem => {
            newArr = subItem.split(',')
            if (newArr[1]) {
              let errBack = this.$g.listErrMsg[newArr[1]]
              errBack = errBack === '9999' ? newArr[2] || '错误' : errBack
              errMsg += errBack + '；'
            }
          })
          dataArr.push({
            rowNum: newArr[0],
            errMsg: errMsg ? errMsg.substr(0, errMsg.length - 1) : ''
          })
        })
      }
      this.tableData = dataArr
      this.loading = false
    },
    submitAction() {
      this.$emit('close')
      this.$emit('close-parent')
    },
    // 显示同步筛查弹窗
    showSyncModel(params) {
      this.syncOpts.visible = true
      this.syncOpts.row = {
        ...params,
        operatorType: 20 // 导入类型
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.bg-grey {
  .el-dialog__header {
    box-shadow: none;
  }
  .el-dialog__body {
    background: #f5f5f5;
  }
}
.success-tip {
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
  padding-bottom: 5px;
  .big {
    font-size: 20px;
  }
}
.err-tip {
  margin: 20px 0 10px;
  .num {
    font-size: 14px;
  }
}
.num {
  color: @red;
  font-size: 16px;
  font-weight: bold;
}
.loading-tip {
  font-size: 16px;
  color: #777;
  text-align: center;
  padding-bottom: 30px;
  img {
    width: 155px;
    margin: 30px 0;
  }
}
</style>
