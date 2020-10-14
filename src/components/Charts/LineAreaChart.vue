<template>
  <div>
    <v-chart :force-fit="true" :height="200" :data="data" :scale="scale" padding="auto">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line :position="position" color="key" />
      <v-area :position="position" color="key" />
      <v-point :position="position" color="key" shape="circle" />
    </v-chart>
  </div>
</template>

<script>
import { DataSet } from '@antv/data-set'
export default {
  name: 'LineAreaChart',
  props: {
    lineData: {
      type: Array,
      default: () => {
        return []
      }
    },
    position: {
      type: String,
      default: ''
    },
    fields: {
      // 展开字段集
      type: Array,
      default: () => {
        return []
      }
    },
    scale: {
      // 数据图形映射设置
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      data: null
    }
  },
  watch: {
    lineData: {
      handler() {
        this.handleData()
      },
      deep: true
    }
  },
  mounted() {
    this.handleData()
  },
  methods: {
    handleData() {
      const dv = new DataSet.View().source(this.lineData)
      dv.transform({
        type: 'fold', // fold类型 对应字段展开
        fields: this.fields, // 展开字段集
        key: 'key', // key字段
        value: 'value' // value字段
      })
      this.data = dv.rows
    }
  }
}
</script>
