<template>
  <a-card :bordered="false">
    <!-- 列表搜索域 用于检索需要的数据-->
    <div class="table-page-search-wrapper">
      <a-form-model ref="form" :model="queryParam" layout="inline" @submit.native.prevent>
        <!-- 主要字段 部分字段添加按键触发刷新 -->
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="规则编号" prop="id">
              <a-input v-model.trim.number="queryParam.id" placeholder="规则编号" @keyup.enter.native="handleSearch" />
            </a-form-model-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-model-item label="使用状态" prop="status">
              <drop-selector
                v-model="queryParam.status"
                :data="[
                  { id: 0, name: '全部' },
                  { id: 1, name: '关闭' },
                  { id: 2, name: '运行中' }
                ]"
                placeholder="请选择"
              />
            </a-form-model-item>
          </a-col>

          <!-- 次要字段 折叠起来 -->
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="调用次数" prop="callNo">
                <a-input-number v-model="queryParam.callNo" placeholder="调用次数" style="width: 100%;" />
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="更新日期" prop="date">
                <a-date-picker
                  v-model="queryParam.date"
                  value-format="YYYY-MM-DD"
                  style="width: 100%;"
                  placeholder="请输入更新日期"
                />
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="使用状态" prop="useStatus">
                <drop-selector
                  v-model="queryParam.useStatus"
                  :data="[
                    { id: 0, name: '全部' },
                    { id: 1, name: '关闭' },
                    { id: 2, name: '运行中' }
                  ]"
                  placeholder="请选择"
                />
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px;" @click="handleReset('form')">重置</a-button>
              <a style="margin-left: 8px;" @click="advanced = !advanced">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <!-- 列表操作域  增加 删除 批量操作等-->
    <div class="table-operator">
      <a-button type="primary" @click="multiStatusModal({ act: 1 })">多状态弹框</a-button>
      <a-button type="primary" @click="editModal">编辑弹框</a-button>
      <a-button type="primary" @click="viewModal">查看弹框</a-button>
      <a-button type="primary" @click="handleDelete">confirm删除</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete" />
            删除
          </a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2">
            <a-icon type="lock" />
            锁定
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px;">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- 列表 -->
    <s-table
      ref="table"
      size="default"
      row-key="key"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :row-selection="rowSelection"
      show-pagination="auto"
    >
      <template #serial="text, record, index">{{ index + 1 }}</template>

      <template #status="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </template>

      <template #description="text">
        <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
      </template>

      <template #action="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a-menu slot="overlay" @click="handleClick">
            <a-menu-item key="1">编辑</a-menu-item>
            <a-menu-item key="2">删除</a-menu-item>
          </a-menu>
          <a>
            更多
            <a-icon type="down" />
          </a>
        </a-dropdown>
      </template>
    </s-table>

    <!-- 一个多状态弹框 查看/编辑 -->
    <task-form-modal :visible.sync="taskFormModalShow" v-bind="taskFormModal" />

    <!-- 一个编辑弹框 -->
    <task-edit-modal :visible.sync="taskEditModalShow" v-bind="taskEditModal">
      <template #title>
        <span style="color: red;">弹框标题</span>
        <a-button type="text" icon="plus" @click="handleDelete">添加</a-button>
      </template>
    </task-edit-modal>

    <!-- 一个查看弹框 -->
    <task-view-modal :visible.sync="taskViewModalShow" :edit-able="false" v-bind="taskViewModal" />
  </a-card>
</template>

<script>
import TaskFormModal from './components/task-form-modal'
import TaskEditModal from './components/task-edit-modal'
import TaskViewModal from './components/task-view-modal'
import { getList } from '@/api/template'
import list from '@/mixins/list'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '规则编号',
    dataIndex: 'no'
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    needTotal: true,
    customRender: text => text + ' 次'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    TaskFormModal,
    TaskEditModal,
    TaskViewModal
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  mixins: [list],
  data() {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {
        id: '',
        status: 0,
        callNo: '',
        date: '',
        useStatus: 0
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getList(requestParameters).then(res => {
          return res.data
        })
      },

      taskFormModalShow: false, // 编辑/查看
      taskFormModal: {
        loading: false,
        record: { status: 1 }, // 参数
        settings: { title: '新增任务' } // 弹窗配置
      },

      taskEditModalShow: false, // 编辑
      taskEditModal: {
        loading: false,
        record: {},
        settings: { title: undefined }
      },

      taskViewModalShow: false, // 查看
      taskViewModal: {
        loading: false,
        record: {},
        settings: { title: '查看' }
      }
    }
  },
  created() {},
  methods: {
    multiStatusModal({ act }) {
      this.taskFormModal.record.status = act
      this.taskFormModalShow = true
    },
    editModal() {
      this.taskEditModalShow = true
      this.taskEditModal.record = {
        taskName: 'eeee',
        startTime: '',
        principal: 0,
        description: ''
      }
    },
    viewModal() {
      const { record } = this.taskViewModal

      this.taskViewModalShow = true
      this.taskViewModal.record = Object.assign({}, record, {
        taskName: '123',
        startTime: '',
        principal: 0,
        description: ''
      })
    },
    async handleDelete() {
      // await this.$confirm()
      // await this.$confirm('Do you Want to delete these items?')
      await this.$confirm('请谨慎操作', '提示', { okType: 'danger' })
      // await this.$confirm(h => <div style="color:red;">确定删除吗？此操作不可逆！</div>)

      const hide = this.$message.loading('删除中...', 0)

      setTimeout(() => {
        hide()
        this.$message.success('删除成功')
      }, 2500)
    },
    handleClick({ key }) {
      console.log(`Click on item ${key}`)
      this.tfmVisible = true
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped></style>
