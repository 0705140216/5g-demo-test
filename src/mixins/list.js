export default {
  data() {
    return {
      advanced: false, // 是否展开
      loadData: async params => {
        const exc = (await this._beforeGetList?.()) || []
        const query = this.getQuery({ ...this.queryParam, ...params }, exc)

        const { data } = await this.apiList(query)
        data && (await this._afterGetList?.(data))
        console.log(data)
        return data
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    /**
     * 动态设置控制栏展开还是缩放
     */
    advancedFn() {
      this.advanced = !this.advanced
    },
    /**
     * 选择框checkbox数据
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 获取查询参数，包含分页信息 page - 当前页码和 limit - 每页显示条数
     * @param {object} more 增加的参数
     * @param {Array} exc 不包含的参数
     */
    getQuery(parameter, exc) {
      let params = Object.assign({}, parameter)
      for (let i in params) {
        params[i] !== 0 && !params[i] && delete params[i]
        exc.includes(i) && delete params[i]
      }
      return params
    },
    /**
     * 获取查询参数，包含分页信息 page - 当前页码和 limit - 每页显示条数
     * @falg {boolean} true 返回第一页 false刷新请求当前页
     */
    handleSearch(flag = true) {
      this.$refs.table.refresh(flag)
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    /**
     * 重置搜索域
     * @param {string} formName 组件refs
     */
    async resetSearch(formName) {
      await new Promise(resolve => {
        this.$refs[formName].resetFields()
        resolve()
      })
      this.handleSearch()
    }
  }
}
