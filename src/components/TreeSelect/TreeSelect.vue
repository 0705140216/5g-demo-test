<template>
  <a-tree-select
    v-model="val"
    :allow-clear="allowClear"
    :tree-data="data"
    :placeholder="placeholder"
    v-bind="$attrs"
    :replace-fields="replaceFields"
    :tree-default-expanded-keys="treeDefaultExpandedKeys"
    :show-checked-strategy="asStrategy"
    :max-tag-count="maxTagCount"
    tree-node-filter-prop="title"
    v-on="$listeners"
  ></a-tree-select>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
const { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } = TreeSelect
export default {
  name: 'TreeSelect',
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
    allowClear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    replaceFields: {
      type: Object,
      default: () => {
        return { children: 'children', title: 'title', key: 'id', value: 'id' }
      }
    },
    expend: {
      // 默认不展开 最多展开两项 false不展开 true展开一项
      type: Boolean,
      default: false
    },
    maxTagCount: {
      type: Number,
      default: 3
    },
    type: {
      type: String,
      default: 'SHOW_ALL' // 选择返回value模式 1 SHOW_ALL 2 SHOW_PARENT 3 SHOW_CHILD
    }
  },
  data() {
    return {
      SHOW_ALL,
      SHOW_PARENT,
      SHOW_CHILD
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
    treeDefaultExpandedKeys() {
      return this.data.length && this.expend ? this.data.map(i => i[this.replaceFields.value]) : []
    },
    asStrategy() {
      // 返回value模式
      let strategy = ['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD'].includes(this.type) ? this.type : 'SHOW_ALL'
      return strategy
    }
  },
  created() {},
  methods: {}
}
</script>
