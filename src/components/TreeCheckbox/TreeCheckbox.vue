<template>
  <div>
    <a-input-search
      v-if="needSearch"
      style="margin-bottom: 8px;"
      allow-clear
      :placeholder="placeholder"
      @change="onSearchChange"
    />
    <a-tree
      v-model="val"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      checkable
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :replace-fields="replaceFields"
      :tree-data="dataAs"
      v-bind="$attrs"
      @expand="onExpand"
      @check="onCheck"
      v-on="$listeners"
    >
      <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50;">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>
<script>
import { debounce } from '@/utils/util'

export default {
  props: {
    value: {
      type: [Array, Number, String]
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请搜索'
    },
    replaceFields: {
      type: Object,
      default: () => {
        return { children: 'children', title: 'title', key: 'id' }
      }
    },
    expend: {
      // 默认不展开 最多展开两项 false不展开 true展开一项
      type: Boolean,
      default: true
    },
    needSearch: {
      // 是否开启搜索
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true, // 是否自动展开父节点
      checkedKeys: [], // 全选id
      halfCheckedKeys: [] // 半选id
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    dataAs() {
      this.needSearch && this.generateList(this.data)
      return this.data
    }
  },
  created() {
    // 默认不展开 最多展开两项 false不展开 true展开一项
    this.expandedKeys = this.data.length && this.expend ? this.data.map(i => i[this.replaceFields.value]) : []
    this.onSearchChange = debounce(this.onSearchChange, 200, false)
  },
  methods: {
    // 展开控制
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // emit半选以及全选数据
    onCheck(checkedKeys, node) {
      let { halfCheckedKeys } = node
      this.halfCheckedKeys = halfCheckedKeys || []
      this.checkedKeys = checkedKeys
      this.$emit('get-object', { halfCheckedKeys, checkedKeys })
    },
    // 搜索改变
    async onSearchChange(e) {
      await this.$nextTick()
      const value = e.target.value
      if (value) {
        const expandedKeys = this.dataList
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return this.getParentKey(item.key, this.data)
            }
            return null
          })
          .filter((item, i, self) => item && self.indexOf(item) === i)
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true
        })
      } else {
        Object.assign(this, {
          expandedKeys: [],
          searchValue: value,
          autoExpandParent: true
        })
      }
    },
    // 获取父级key
    getParentKey(key, tree) {
      let parentKey
      const { children: childrenName, key: keyName } = this.replaceFields
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node[childrenName]) {
          if (node[childrenName].some(item => item[keyName] === key)) {
            parentKey = node[keyName]
          } else if (this.getParentKey(key, node[childrenName])) {
            parentKey = this.getParentKey(key, node[childrenName])
          }
        }
      }
      return parentKey
    },
    generateList(data) {
      // 扁平化数据格式
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const { children: childrenName, title: titleName, key: keyName } = this.replaceFields
        const key = node[keyName]
        const title = node[titleName]
        this.dataList.push({ key, title })
        this.needSearch && (node.scopedSlots = { title: titleName })
        if (node[childrenName]) {
          this.generateList(node[childrenName])
        }
      }
    }
  }
}
</script>
