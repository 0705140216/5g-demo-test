<template>
  <div>
    <!-- 顶部统计栏 -->
    <div class="header-cond">
      <a-card>
        <a-row :gutter="[16, 8]" type="flex" justify="space-between" align="middle">
          <a-col :span="4">
            <drop-selector
              v-if="canSchoolSelect"
              v-model="queryParam.shoolId"
              style="width:100%"
              :data="shoolList"
              placeholder="请选择"
              @click="handleSearch"
            />
          </a-col>
          <a-col :span="14" class="cond-num">
            <div class="top-stat">
              <span>待审批 {{ approveData.pending | numberFormat }}人</span>
              <span>已通过 {{ approveData.passed | numberFormat }}人</span>
              <span>已拒绝 {{ approveData.rejected | numberFormat }}人</span>
              <span>已撤销 {{ approveData.revoked | numberFormat }}人</span>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <a-card :bordered="false">
      <!-- 列表搜索域 用于检索需要的数据-->
      <div class="table-page-search-wrapper">
        <a-form-model ref="form" :model="queryParam" layout="inline" @submit.native.prevent>
          <!-- 主要字段 部分字段添加按键触发刷新 -->
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-model-item label="学段" prop="id">
                <drop-selector
                  v-model="queryParam.prefx"
                  style="width:100%"
                  :data="schoolTypeList"
                  placeholder="请选择"
                  @click="handleSearch"
                />
              </a-form-model-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-model-item label="学年" prop="id">
                <drop-selector
                  v-model="queryParam.schoolYear"
                  style="width:100%"
                  :data="schoolYearList"
                  placeholder="请选择"
                  @click="handleSearch"
                />
              </a-form-model-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-model-item label="班级" prop="id">
                <drop-selector
                  v-model="queryParam.class"
                  style="width:100%"
                  :data="classList"
                  placeholder="请选择"
                  @click="handleSearch"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-model-item label="性别" prop="id">
                <drop-selector
                  v-model="queryParam.sex"
                  style="width:100%"
                  :data="sexList"
                  placeholder="请选择"
                  @click="handleSearch"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="请假时间范围" prop="date">
                <a-range-picker v-model="queryParam.date" value-format="YYYY-MM-DD" style="width: 100%;" />
              </a-form-model-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-model-item label="请假类型" prop="id">
                <drop-selector
                  v-model="queryParam.leaveType"
                  style="width:100%"
                  :data="leaveTypeList"
                  placeholder="请选择"
                />
              </a-form-model-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-model-item label="学生姓名" prop="callNo">
                <a-input v-model.trim="queryParam.key" placeholder="输入学生姓名" style="width: 100%;" />
              </a-form-model-item>
            </a-col>
            <!-- 次要字段 折叠起来 -->
            <!-- <template v-if="advanced"></template> -->

            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button ghost type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px;" @click="handleReset('form')">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form-model>
      </div>

      <!-- 列表操作域  增加 删除 批量操作等-->
      <div class="table-operator">
        <a-button type="primary" @click="handleClick({ key: '21' })">添加请假学生</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleClick">
            <a-menu-item key="11">
              <!-- <a-icon type="delete" /> -->
              审批
            </a-menu-item>
            <a-menu-item key="31">
              <!-- <a-icon type="delete" /> -->
              撤销
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px;">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <div class="table-operator">
        <a-form-model ref="form1" :model="queryParam1" layout="inline" @submit.native.prevent>
          <a-row :gutter="10">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审批状态" prop="auditStatus">
                <checkbox-select
                  v-model="queryParam1.auditStatus"
                  allow-clear
                  :data="auditStatusList"
                  placeholder="请选择学段"
                  @change="handleSearch"
                ></checkbox-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>

      <!-- 列表 -->
      <s-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        show-pagination="auto"
        :row-selection="rowSelection"
        :scroll="{ x: 1500 }"
      >
        <template #serial="text, record, index">{{ index + 1 }}</template>
        <template #dateLength="text">{{ text }}天</template>

        <template #status="text, record">
          <a-tag v-if="text === 0" :color="text | statusTypeFilter">{{ text | statusFilter }}</a-tag>
          <a-popover v-else placement="right">
            <template slot="content">
              <p>审批人：{{ record.approver }}</p>
              <p v-if="text === 3">撤销时间：{{ record.approvalTime }}</p>
              <template v-else>
                <p>审批时间：{{ record.approvalTime }}</p>
                <p v-if="text === 2">拒绝原因：{{ record.refuseReason }}</p>
              </template>
            </template>
            <a-tag style="cursor:pointer" :color="text | statusTypeFilter">{{ text | statusFilter }}</a-tag>
          </a-popover>
          <!-- <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /> -->
        </template>

        <template #applicant="text, record">
          <p>{{ text }}</p>
          <p>{{ record.applyPhone }}</p>
        </template>
        <!-- <template #description="text">
        <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
      </template> -->

        <template #action="text, record">
          <a @click="handleClick({ key: '4', ...record })">查看</a>
          <a-divider type="vertical" />
          <a-dropdown v-if="record.status === 0">
            <a-menu slot="overlay" @click="({ key }) => handleClick({ key, ...record })">
              <a-menu-item key="1">审批</a-menu-item>
              <a-menu-item key="2">编辑</a-menu-item>
              <a-menu-item key="3">撤销</a-menu-item>
            </a-menu>
            <a>
              更多
              <a-icon type="down" />
            </a>
          </a-dropdown>
        </template>
      </s-table>

      <!-- 审批 -->
      <approve-modal
        v-if="approveShow"
        :visible.sync="approveShow"
        v-bind="approveInfo"
        @on-submit-success="handleSearch(false)"
      />
      <!-- 新增请假学生 -->
      <add-leave-modal
        v-if="addLeaveShow"
        :visible.sync="addLeaveShow"
        v-bind="addLeaveInfo"
        @on-submit-success="handleSearch(false)"
      />
    </a-card>
  </div>
</template>

<script>
import ApproveModal from './components/approve-modal'
import AddLeaveModal from './components/add-leave-modal'

import list from '@/mixins/list'

import { approveData } from './static' // 模拟列表数据

const columns = [
  // {
  //   title: '#',
  //   scopedSlots: { customRender: 'serial' }
  // },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '性别',
    dataIndex: 'sex'
  },
  {
    title: '学段',
    dataIndex: 'prefx'
  },
  {
    title: '学年',
    dataIndex: 'schoolYear'
  },
  {
    title: '班级',
    dataIndex: 'class'
  },
  {
    title: '开始时间',
    dataIndex: 'start'
  },
  {
    title: '结束时间',
    dataIndex: 'end'
  },
  {
    title: '请假时长',
    dataIndex: 'dateLength',
    scopedSlots: { customRender: 'dateLength' }
  },
  {
    title: '请假类型',
    dataIndex: 'leaveType'
  },
  {
    title: '请假原因',
    dataIndex: 'leaveReason'
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '申请人',
    dataIndex: 'applicant',
    width: 120,
    scopedSlots: { customRender: 'applicant' }
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 130,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'orange',
    text: '待审批'
  },
  1: {
    status: 'purple',
    text: '已通过'
  },
  2: {
    status: 'red',
    text: '已拒绝'
  },
  3: {
    status: '',
    text: '已撤销'
  }
}

const listData = [
  {
    id: '1',
    stuId: '1',
    name: '王晓峰',
    sex: '男',
    prefx: '小学',
    schoolYear: '2019',
    class: '01',
    start: '2020-7-7 上午',
    end: '2020-7-7 上午',
    leaveType: '1',
    dateLength: '0.5',
    leaveReason: 'ddddddddddddd',
    status: 0,
    applicant: '张三',
    applyPhone: '15236521478',
    applyTime: '2020-7-7 12:15',
    approvalTime: '2020-7-7 12:20',
    approver: '李四',
    refuseReason: ''
  },
  {
    id: '2',
    stuId: '2',
    name: '壮壮',
    sex: '男',
    prefx: '小学',
    schoolYear: '2019',
    class: '01',
    start: '2020-7-7 上午',
    end: '2020-7-7 上午',
    leaveType: '2',
    dateLength: '0.5',
    leaveReason: 'ddddddddddddd',
    status: 1,
    applicant: '张三',
    applyPhone: '15236521478',
    applyTime: '2020-7-7 12:15',
    approvalTime: '2020-7-7 12:20',
    approver: '李四',
    refuseReason: 'aaaaaaaaa',
    cause: '1',
    causeName: '感冒',
    symptom: 'mmmmmmmmmm'
  },
  {
    id: '3',
    stuId: '3',
    name: '韩梅梅',
    sex: '女',
    prefx: '小学',
    schoolYear: '2019',
    class: '01',
    start: '2020-7-7 上午',
    end: '2020-7-7 上午',
    leaveType: '1',
    dateLength: '0.5',
    leaveReason: 'ddddddddddddd',
    status: 2,
    applicant: '张三',
    applyPhone: '15236521478',
    applyTime: '2020-7-7 12:15',
    approvalTime: '2020-7-7 12:20',
    approver: '李四',
    refuseReason: '这是一天拒绝的请假申请，你说怎么办呢，不行，还得拒绝'
  },
  {
    id: '4',
    stuId: '4',
    name: '李磊',
    sex: '男',
    prefx: '小学',
    schoolYear: '2019',
    class: '01',
    start: '2020-7-7 上午',
    end: '2020-7-7 上午',
    leaveType: '1',
    dateLength: '0.5',
    leaveReason: 'ddddddddddddd',
    status: 3,
    applicant: '张三',
    applyPhone: '15236521478',
    applyTime: '2020-7-7 12:15',
    approvalTime: '2020-7-7 12:20',
    approver: '李四',
    refuseReason: 'aaaaaaaaa'
  }
]

const auditStatusList = [
  { id: 1, name: '待审批' },
  { id: 2, name: '已通过' },
  { id: 3, name: '已拒绝' },
  { id: 4, name: '已撤销' }
]

export default {
  name: 'TableList',
  components: {
    ApproveModal,
    AddLeaveModal
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
    this.auditStatusList = auditStatusList
    return {
      approveData: {
        pending: 35,
        passed: 71,
        rejected: 56,
        revoked: 22
      },
      shoolList: [
        { id: '1', name: '第一小学' },
        { id: '2', name: '第二小学' },
        { id: '3', name: '第三小学' },
        { id: '4', name: '第四小学' }
      ],
      schoolTypeList: [
        { id: '1', name: '学前' },
        { id: '2', name: '小学' },
        { id: '3', name: '初中' },
        { id: '4', name: '高中' },
        { id: '5', name: '大学' }
      ],
      schoolYearList: [
        { id: '2020', name: '2020' },
        { id: '2019', name: '2019' },
        { id: '2018', name: '2018' },
        { id: '2017', name: '2017' }
      ],
      classList: [
        { id: '1', name: '01班' },
        { id: '2', name: '02班' },
        { id: '3', name: '03班' },
        { id: '4', name: '04班' }
      ],
      sexList: [
        { id: '1', name: '男' },
        { id: '2', name: '女' }
      ],
      leaveTypeList: [
        { id: '1', name: '事假' },
        { id: '2', name: '病假' }
      ],
      // 查询参数
      queryParam: {
        shoolId: '1',
        prefx: undefined,
        schoolYear: undefined,
        class: undefined,
        sex: undefined,
        leaveType: undefined,
        date: ['', ''],
        key: ''
      },
      queryParam1: {
        auditStatus: [1, 2] // 审批状态默认值
      },
      loadData: () => this.scrDataLoad(),

      approveShow: false, // 审批
      approveInfo: {
        loading: false,
        record: {}, // 参数
        settings: { title: '审批' } // 弹窗配置
      },
      addLeaveShow: false, // 添加请假学生
      addLeaveInfo: {
        loading: false,
        record: {}, // 参数
        settings: { title: '审批', width: 700 } // 弹窗配置
      }
    }
  },
  computed: {
    canSchoolSelect() {
      return this.orgProperty == 20 && [10, 20].includes(this.roleType) // 学校下拉框
    }
  },
  created() {
    // this.init()
  },
  methods: {
    async init() {
      const hide = this.$message.loading('加载中...', 0)
      Promise.all([this.getStaticData()])
        .then(([apprRes]) => {
          this.approveData = apprRes
        })
        .finally(() => {
          hide()
        })
    },
    // 挡板table数据
    scrDataLoad() {
      return new Promise(resolve => {
        const data = {
          list: listData,
          pageNum: 1,
          pageSize: 10,
          total: '4',
          totalPage: '1'
        }
        resolve(data)
      })
    },
    getStaticData() {
      console.log(approveData)

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(approveData)
        }, 2000)
      })
    },

    handleClick({ key, ...record }) {
      console.log(`Click on item ${key}`)
      switch (key) {
        case '1': // 审批
          this.toApprove([record])
          break
        case '11': // 批量审批
          this.toApprove(this.selectedRows)
          break
        case '3': // 撤销
          this.toApprove([record], 2)
          break
        case '31': // 批量撤销
          this.toApprove(this.selectedRows, 2)
          break
        case '21': // 新增学生
          this.toLeaveStudent({ status: 0 })
          break
        case '2': // 编辑学生
          this.toLeaveStudent({ status: 1, info: record })
          break
        case '4': // 查看学生
          this.toLeaveStudent({ status: 2, info: record })
          break
      }
      // this.tfmVisible = true
    },
    toLeaveStudent(params) {
      console.log('ssss', params)
      this.addLeaveShow = true
      this.addLeaveInfo.record = params
    },
    toApprove(list, type = 1) {
      this.approveInfo.settings.title = type === 1 ? '审批' : '撤销'
      this.approveShow = true
      this.approveInfo.record = { list, type }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
.header-cond {
  margin-bottom: 16px;
  .top-stat {
    font-size: 24px;
    text-align: right;
    font-weight: 600;
    span {
      padding-left: 20px;
    }
  }
}
</style>
<style lang="less">
.ant-popover-inner-content {
  max-width: 300px;
}
</style>
