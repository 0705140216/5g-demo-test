<template>
  <div>
    <p class="chat-title">{{ chartTitle }}</p>
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale" :padding="padding">
      <v-tooltip />
      <v-axis data-key="rate" :label="label" />
      <v-legend :position="position" />
      <v-line :position="`${dataKey}*rate`" :color="color" :label="labelConfig" />
      <v-point :position="`${dataKey}*rate`" :color="color" :size="4" :v-style="vstyle" :shape="'circle'" />
    </v-chart>
  </div>
</template>
<script>
// 多条折现图表
const DataSet = require('@antv/data-set')
export default {
  name: 'LineChart',
  props: {
    dataKey: {
      // 横坐标在数据中的主键名
      type: String,
      default: 'regionName'
    },
    height: {
      type: Number,
      default: 400
    },
    width: {
      type: Number,
      default: 450
    },
    chartTitle: {
      type: String,
      default: ''
    },
    chartData: {
      // 数据形如是[{abscissa:南湖区,幼儿园：12.56，初中：15.33},{abscissa:嘉兴区,幼儿园：15.33，初中：16.33}]
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    scale: {
      // 数据图形映射设置
      type: Array,
      default: () => {
        return []
      }
    },
    fields: {
      // 与chartdata对应的线的key，数据形如是[幼儿园,初中]
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    labelConfig: {
      // 文本显示设置
      type: Array,
      default: () => {
        return []
      }
    },
    label: {
      // 纵坐标label设置
      type: Object,
      default: () => {
        return {
          formatter: function formatter(val) {
            if (val.indexOf('.00') != -1) {
              return val.split('.00').join('')
            } else {
              return val
            }
          }
        }
      }
    },
    vstyle: {
      type: Object,
      default: () => {
        return { stroke: '#fff', lineWidth: 1 }
      }
    },
    position: {
      // 图例位置
      type: String,
      default: 'bottom-center'
    },
    padding: {
      type: Array,
      default: () => [40, 40, 60, 40]
    },
    color: {
      type: Array,
      default: () => {
        return ['grade']
      }
    }
  },
  data() {
    return {
      data: ''
    }
  },
  mounted() {
    this.handleData()
  },
  methods: {
    handleData() {
      const dv = new DataSet.View().source(this.chartData)
      dv.transform({
        type: 'fold',
        fields: this.fields,
        key: 'grade',
        value: 'rate'
      })
      this.data = dv.rows
    }
  }
}
</script>
<style scoped lang="less">
@import './chart.less';
</style>
