<template>
  <a-modal v-bind="$attrs" @close="$emit('close')">
    <div>
      <a-spin :spinning="loading">
        <p class="tip">以下筛查任务中的班级学生信息已同步</p>
        <ul class="task-list">
          <li v-for="(item, index) in formData.taskList" :key="item.taskId">
            <span>{{ index + 1 }}.</span>
            {{ item.taskPlanName }}
          </li>
        </ul>
      </a-spin>
    </div>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="$emit('close')">确 定</el-button>
    </span> -->
    <template #footer>
      <a-button type="primary" @click="$emit('close')">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'SyncTipModel',
  props: {
    record: {
      type: Object,
      default: () => {
        return {
          taskList: [], // 任务列表
          operatorType: 20, // 操作类型 20：新增、导入； 21：编辑
          stuIds: [] // 学生id集合
        }
      }
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {},
  created() {
    this.formData = Object.assign({}, this.record, { taskIds: [] })
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.tip {
  line-height: 25px;
  margin-bottom: 10px;
  letter-spacing: 1px;
  span {
    color: @red;
    font-size: 16px;
    font-weight: bold;
  }
}
.task-list {
  li {
    line-height: 20px;
    margin-bottom: 10px;
  }
}
</style>
