<template>
  <a-card :bordered="false" class="table-container">
    <!-- 列表搜索域 用于检索需要的数据-->
    <div class="table-page-search-wrapper">
      <a-form-model ref="form" :model="queryParam" layout="inline" @submit.native.prevent>
        <!-- 主要字段 部分字段添加按键触发刷新 -->
        <a-row :gutter="10">
          <a-col :md="4" :sm="24">
            <a-form-model-item label="规则编号" prop="id">
              <a-input
                v-model.trim="queryParam.id"
                placeholder="请输入编号规则"
                allow-clear
                @keyup.enter.native="handleSearch"
              />
            </a-form-model-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-model-item label="使用状态" prop="status">
              <drop-selector
                v-model="queryParam.status"
                allow-clear
                :data="[]"
                placeholder="请选择使用状态"
                @change="handleSearch"
              ></drop-selector>
            </a-form-model-item>
          </a-col>

          <!-- 次要字段 折叠起来 -->
          <template v-if="advanced">
            <a-col :md="5" :sm="24">
              <a-form-model-item label="选择地区" prop="areaIds">
                <!--                expand-trigger="click"-->
                <!--                change-on-select-->
                <drop-cascader
                  v-model="queryParam.areaIds"
                  placeholder="请选择地区"
                  @change="handleSearch"
                ></drop-cascader>
              </a-form-model-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-model-item label="更新日期" prop="date">
                <a-date-picker
                  v-model="queryParam.date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择日期"
                  @change="handleSearch"
                />
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :md="(!advanced && 6) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button ghost type="primary" @click="handleSearch">查询</a-button>
              <a-button @click="resetSearch('form')">重置</a-button>
              <a style="margin-left: 8px;" @click="advancedFn">
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
      <a-button type="primary" icon="plus" @click="handleClick({ act: 2 })">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu
          slot="overlay"
          @click="
            ({ key }) => {
              handleClick({ act: key })
            }
          "
        >
          <a-menu-item :key="4">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button>
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <!-- 列表 -->
    <s-table
      ref="table"
      size="default"
      row-key="id"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :row-selection="rowSelection"
      show-pagination="auto"
    >
      <template #serial="text, record, index">{{ index + 1 }}</template>

      <template #action="text, record">
        <a @click="handleClick({ act: 0, ...record })">查看</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a-menu slot="overlay" @click="({ key }) => handleClick({ act: key, ...record })">
            <a-menu-item :key="1">编辑</a-menu-item>
            <a-menu-item :key="3">删除</a-menu-item>
          </a-menu>
          <a>
            更多
            <a-icon type="down" />
          </a>
        </a-dropdown>
      </template>
    </s-table>

    <!--    弹窗示例-->
    <table-model
      v-if="tableModel.visible"
      :visible.sync="tableModel.visible"
      v-bind="tableModel"
      @on-submit-success="handleSearch(false)"
    />
  </a-card>
</template>

<script>
import TableModel from '_views/template/components/table-model.vue'
import list from '@/mixins/list'
import { getList } from '@/api/template'

const columns = [
  { title: '#', scopedSlots: { customRender: 'serial' } },
  { title: '规则编号', dataIndex: 'no' },
  { title: '描述', dataIndex: 'description', scopedSlots: { customRender: 'description' } },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    ellipsis: true,
    sorter: true,
    needTotal: true,
    customRender: text => text + ' 次'
  },
  { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
  { title: '更新时间', dataIndex: 'updatedAt' },
  { title: '操作', dataIndex: 'action', width: '150px', scopedSlots: { customRender: 'action' } }
]

export default {
  name: 'TableListTwo',
  components: {
    TableModel
  },
  mixins: [list],
  data() {
    this.columns = columns
    this.apiList = getPlanList
    return {
      // 查询参数
      queryParam: {
        id: '',
        status: undefined,
        areaIds: [],
        date: ''
      },
      tableModel: {
        settings: { title: '新增模板' }, // 弹窗配置
        status: 0, // 0查看 1编辑 2新增
        record: {}, // 带给详情的参数,例如id
        visible: false
      }
    }
  },
  created() {
    this.getSelectList()
  },
  methods: {
    handleClick({ act, id } = {}) {
      let title
      switch (+act) {
        case 0:
        case 1:
          title = act == 1 ? `编辑模板文件` : `查看模板文件`
          this.setModel('tableModel', { title }, act, { id })
          break
        case 2:
          this.setModel('tableModel', { title: `新增模板文件` }, act)
          break
        case 3: // 单个删除
          this.handleDelete({ id })
          break
        case 4: // 批量删除
          this.handleMoreDelete()
          break
      }
    },
    /**
     * 批量删除
     */
    async handleMoreDelete() {
      console.log(this.selectedRowKeys)
      console.log(this.selectedRows)
      // 注意selectedRowKeys 的id集合取决于s-table 的row-key
      await this.$confirm(`是否删除${this.selectedRowKeys.length}条模板`)
      const hide = this.$message.loading(`删除中..`, 0)
      getList()
        .then(() => {
          this.$message.success('删除成功')
          this.handleSearch(false)
        })
        .finally(() => {
          hide()
        })
    },
    /**
     * 删除
     */
    async handleDelete({ id }) {
      await this.$confirm(`是否删除【${id}】模板`)
      const hide = this.$message.loading(`删除中..`, 0)
      getList(id)
        .then(() => {
          this.$message.success('删除成功')
          this.handleSearch(false)
        })
        .finally(() => {
          hide()
        })
    },
    /**
     * 获取下拉框数据
     */
    getSelectList() {
      // getList().then((data)=>{
      //   this.example=data
      // })
    },
    /**
     * 设置弹出层状态
     */
    setModel(p, s = {}, a = 0, r = {}, v = true) {
      this[p].settings = { ...this[p].settings, ...s }
      this[p].status = a
      this[p].record = r
      this[p].visible = v
    },
    /**
     * 获取table数据前
     */
    _beforeGetList() {
      return new Promise(resolve => {
        resolve()
        // 过滤不要的参数
        // resolve(['id'])
      })
    },
    /**
     * 获取table数据前
     */
    _afterGetList(data) {
      return new Promise(resolve => {
        resolve(data)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
