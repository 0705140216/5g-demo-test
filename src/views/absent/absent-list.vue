<template>
  <div>
    <!-- 顶部条件及展示 -->
    <div class="header-cond">
      <a-card>
        <a-row :gutter="[16, 8]" type="flex" justify="space-between" align="middle">
          <a-col :span="4">
            <drop-selector
              v-if="canSchoolSelect"
              v-model="headScr.school"
              :data="schoolList"
              label-key="orgName"
              value-key="orgId"
              dropdown-class-name="custom-z-index"
              style="width: 100%;"
              placeholder="请选择学校"
              @change="handleClick({ act: 1 })"
            />
          </a-col>
          <a-col :span="14" class="cond-num">
            <p>待审批 {{ peopleNum | numberFormat }}人</p>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 表格 -->
    <div>
      <a-card>
        <!-- 筛选条件 -->
        <div class="table-page-search-wrapper">
          <a-form-model ref="form" :model="queryParam" layout="inline" @submit.native.prevent>
            <!-- 主要字段 部分字段添加按键触发刷新 -->
            <a-row :gutter="10">
              <a-col :md="4" :sm="24">
                <a-form-model-item label="学段" prop="period">
                  <drop-selector
                    v-model="queryParam.period"
                    allow-clear
                    label-key="label"
                    value-key="value"
                    :data="$g.schoolType"
                    placeholder="请选择学段"
                    @change="handleSearch"
                  ></drop-selector>
                </a-form-model-item>
              </a-col>

              <a-col :md="4" :sm="24">
                <a-form-model-item label="学年" prop="schoolYear">
                  <drop-selector
                    v-model="queryParam.schoolYear"
                    allow-clear
                    :data="schoolYearList"
                    placeholder="请选择学年"
                    @change="handleSearch"
                  ></drop-selector>
                </a-form-model-item>
              </a-col>

              <a-col :md="4" :sm="24">
                <a-form-model-item label="班级" prop="class">
                  <drop-selector
                    v-model="queryParam.class"
                    allow-clear
                    :data="classList"
                    placeholder="请选择班级"
                    @change="handleSearch"
                  ></drop-selector>
                </a-form-model-item>
              </a-col>

              <a-col :md="4" :sm="24">
                <a-form-model-item label="性别" prop="sex">
                  <drop-selector
                    v-model="queryParam.sex"
                    allow-clear
                    :data="sexList"
                    placeholder="请选择性别"
                    @change="handleSearch"
                  ></drop-selector>
                </a-form-model-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-model-item label="时间范围" prop="rangeTime">
                  <range-picker v-model="queryParam.rangeTime" />
                </a-form-model-item>
              </a-col>

              <a-col :md="4" :sm="24">
                <a-form-model-item label="学生姓名" prop="stuName">
                  <a-input v-model="queryParam.stuName" placeholder="请输入学生姓名"></a-input>
                </a-form-model-item>
              </a-col>

              <a-col :md="(!advanced && 6) || 24" :sm="24">
                <span
                  class="table-page-search-submitButtons"
                  :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                >
                  <a-button ghost type="primary" @click="handleSearch">查询</a-button>
                  <a-button @click="resetSearch('form')">重置</a-button>
                </span>
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
        >
          <template #sex="text">{{ text | getSex }}</template>

          <template #description="text, record">{{ text }}（{{ record.applyPhone }}）</template>

          <template #action="text, record">
            <a v-if="canSee(record)" @click="handleClick({ act: 0, ...record })">查看</a>
          </template>
        </s-table>
      </a-card>
    </div>

    <stu-details-modal
      v-if="stuDetailsModal.visible"
      :visible.sync="stuDetailsModal.visible"
      v-bind="stuDetailsModal"
    />
  </div>
</template>

<script>
import list from '@/mixins/list'
import { mapState } from 'vuex'
import StuDetailsModal from './components/stu-details-modal'
import { auditList } from '_views/absent/static'

const columns = [
  { title: '姓名', dataIndex: 'stuName' },
  { title: '性别', dataIndex: 'sex', scopedSlots: { customRender: 'sex' } },
  { title: '学段', dataIndex: 'period' },
  { title: '学年', dataIndex: 'schoolYear' },
  { title: '班级', dataIndex: 'class' },
  { title: '开始时间', dataIndex: 'startTime' },
  { title: '结束时间', dataIndex: 'endTime' },
  { title: '请假时长', dataIndex: 'durationLeave' },
  { title: '病因', dataIndex: 'pathogeny' },
  { title: '症状', dataIndex: 'symptom' },
  { title: '申请人', dataIndex: 'description', scopedSlots: { customRender: 'description' } },
  { title: '申请时间', dataIndex: 'createdTime' },
  { title: '操作', dataIndex: 'action', width: '150px', scopedSlots: { customRender: 'action' } }
]

export default {
  name: 'AbsentList',
  components: {
    StuDetailsModal
  },
  mixins: [list],
  data() {
    this.columns = columns
    return {
      headScr: {
        school: undefined
      },
      queryParam: {},
      schoolList: [],
      peopleNum: 55,
      loadData: () => this.scrDataLoad(),
      stuDetailsModal: {
        settings: { title: '查看因病缺课信息', width: 600 }, // 弹窗配置
        status: 0, // 0查看 1编辑 2新增
        record: {}, // 带给详情的参数,例如id
        visible: false
      }
    }
  },
  computed: {
    ...mapState({
      orgProperty: state => state.user.orgInfo.orgProperty,
      orgId: state => state.user.orgInfo.orgId,
      roleType: state => state.user.roles.roleType
    }),
    canSchoolSelect() {
      return this.orgProperty == 20 && [10, 20].includes(this.roleType) // 学校下拉框
    },
    canSee() {
      return function({ notCheckType, auditStatus } = {}) {
        return notCheckType && auditStatus == 1 // 查看
      }
    }
  },
  created() {
    if (this.orgProperty == 20) this.headScr.school = this.orgId // 集团学校默认本校
    this.getSelectList()
  },
  methods: {
    getSelectList() {
      // ...
      this.schoolList = [
        { orgId: '224285397914628096', orgName: '第二附属中学' },
        { orgId: '221286180665360384', orgName: '天都小学' }
      ]
      this.schoolYearList = [
        { id: 1, name: '2019' },
        { id: 2, name: '2020' }
      ]
      this.classList = [
        { id: 1, name: '01' },
        { id: 2, name: '02' }
      ]
      this.sexList = [
        { id: 1, name: '男' },
        { id: 2, name: '女' }
      ]
    },
    // 挡板table数据
    scrDataLoad() {
      return new Promise(resolve => {
        const data = {
          list: auditList,
          pageNum: 1,
          pageSize: 10,
          total: '4',
          totalPage: '1'
        }
        resolve(data)
      })
    },
    handleClick({ act, ...extra } = {}) {
      switch (act) {
        case 0: // 查看
          {
            const diagnosisTreat = [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
              },
              {
                uid: '-2',
                name: 'image.png',
                status: 'done',
                url:
                  'http://122.112.220.75:9000/medical/20191017-12/9f5a3fa5-3180-4534-85ea-4d96ea74d464?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20200923%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200923T090824Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c3f0f3ee28a92541c8410f18121eb849d1dfd205d6042e9332c3d9661887cf36'
              }
            ]
            this.setModel('stuDetailsModal', {}, 0, { ...extra, diagnosisTreat })
          }
          break
        case 1: // 切换学校
          this.$message.info('切换学校')
          break
      }
    },
    setModel(p, s = {}, a = 0, r = {}, v = true) {
      this[p].settings = { ...this[p].settings, ...s }
      this[p].status = a
      this[p].record = r
      this[p].visible = v
    }
  }
}
</script>

<style lang="less" scoped>
.textStyle(@fontSize: 32px, @color: @light-black) {
  font-size: @fontSize;
  color: @color;
}
.header-cond {
  .marginB(16px);
}
.cond-num {
  .flex(flex-end);
  p {
    .textStyle(24px);
    .marginB(0);
    margin-right: 32px;
  }
}
</style>
