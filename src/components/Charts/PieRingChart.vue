<template>
  <div>
    <p class="chat-title" v-if="chartTitle">{{ chartTitle }}</p>
    <v-chart :force-fit="fit" :height="height" :width="width" :data="data" :scale="pieScale" :padding="padding">
      <!-- <v-tooltip :show-title="false" data-key="name*percent" /> -->
      <v-tooltip :htmlContent="htmlContent" />
      <v-axis />
      <v-legend v-if="legend" />
      <v-pie position="percent" :v-style="pieStyle" :label="labelConfig" :color="color" />
      <v-coord type="theta" :radius="radius" :inner-radius="innerRadius" />
      <v-guide
        v-if="innerRadius && htmlGuideHtml"
        type="html"
        :position="htmlGuidePosition"
        :html="htmlGuideHtml"
      ></v-guide>
    </v-chart>
  </div>
</template>

<script>
import { DataSet } from '@antv/data-set'
import { numberFormat, percentFormat } from '@/utils/filter'
export default {
  name: 'PieRingChart',
  props: {
    height: {
      type: Number,
      default: 400
    },
    width: {
      type: Number,
      default: 480
    },
    radius: {
      type: Number,
      default: 1
    },
    innerRadius: {
      type: Number,
      default: 0
    },
    padding: {
      type: Array,
      default: () => [50, 50, 50, 50]
    },
    fit: {
      //自适应，若为true,在flex布局下会发生图表宽度初始化失败情况,届时需要二次绘制
      type: Boolean,
      default: () => {
        return false
      }
    },
    chartTitle: {
      type: String,
      default: ''
    },
    chartData: {
      //数据形如是[{ name: 高中, value: 56, rate: 0.15 }]
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    pieStyle: {
      type: Object,
      default: () => {
        return {
          stroke: '#fff',
          lineWidth: 1
        }
      }
    },
    pieScale: {
      // 数据图形映射设置
      type: Array,
      default: () => {
        return [
          {
            dataKey: 'percent',
            min: 0,
            formatter: '.2%'
          }
        ]
      }
    },
    labelConfig: {
      // 文本显示设置
      type: Array,
      default: () => {
        return [
          'percent',
          {
            formatter: (val, item) => {
              return item.point.name + ': ' + val
            }
          }
        ]
      }
    },
    field: {
      // 数量
      type: String,
      default: ''
    },
    totalNum: {
      type: Number,
      default: 500
    },
    htmlGuideHtml: {
      // 中心展示数据设置
      type: String,
      default: ''
    },
    legend: {
      type: Boolean,
      default: true
    },
    color: {
      //数据形如是['name', ['#3FCECE', '#9B66E6', '#4B588D', '#FCD540', '#55CE79', '#3AA1FF']]
      type: Array,
      default: () => {
        return ['name']
      }
    }
  },
  data() {
    this.htmlGuidePosition = ['50%', '50%']
    return {
      data: null,
      htmlContent: function htmlContent(title, items) {
        let html =
          '<div style="position: absolute;background:#fff;padding:5px;border-radius:5px;box-shadow:#ccc 0px 0px 3px 1px;display: flex;align-items: center;z-index:2020">'
        let point = `<div style="width: 8px;height: 8px;border-radius:50%;display: inline-block;margin-right:5px;background:${items[0].color}"></div>`
        let data = `<div style="display: inline-block">${items[0].name}：${numberFormat(
          items[0].point._origin.value * 1
        )}（${items[0].value}）</div>`
        return `${html}${point}${data}</div>`
      }
    }
  },
  watch: {
    chartData: {
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
      const dv = new DataSet.View().source(this.chartData)
      dv.transform({
        type: 'percent',
        field: 'value',
        dimension: 'name',
        as: 'percent'
      })
      this.data = dv.rows
    }
  }
}
</script>
<style scoped lang="less">
@import './chart.less';
</style>
