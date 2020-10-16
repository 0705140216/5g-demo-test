<template>
  <a-select
    v-model="val"
    show-search
    allow-clear
    :default-active-first-option="false"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    v-bind="$attrs"
    v-on="$listeners"
    @search="getSearchList"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="item in searchList" :key="item[valueKey]" :disabled="unableItems.includes(item[valueKey])">
      {{ item[labelKey] }}
    </a-select-option>
  </a-select>
</template>

<script>
import { debounce } from '@/utils/util'
export default {
  name: 'RemoteSelect',
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    listApi: {
      // 传入的接口名
      type: Function,
      required: true,
      default: () => {}
    },
    query: {
      // 传入的请求参数，除本搜索框外
      type: Object,
      default: () => {}
    },
    keyWord: {
      // 本搜索框请求参数键值名
      type: String,
      default: 'keyWord'
    },
    unableItems: {
      // 禁用选项
      type: Array,
      default: () => {
        return []
      }
    },
    initData: {
      // 是否初始化调用
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fetching: false,
      searchList: []
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
    }
  },
  created() {
    this.getSearchList = debounce(this.getSearchList, true)
    this.initData && this.getSearchList()
  },
  methods: {
    getSearchList(val = '') {
      this.searchList = []
      let params = { [this.keyWord]: val, ...this.query }
      this.fetching = true
      this.listApi(params)
        .then(({ data }) => {
          this.searchList = data || []
        })
        .finally(() => {
          this.fetching = false
        })
    }
  }
}
</script>
