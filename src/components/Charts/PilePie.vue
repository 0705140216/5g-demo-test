<template>
  <div>
    <p class="chat-title" v-if="chartTitle">{{ chartTitle }}</p>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" :padding="padding">
      <!-- <v-tooltip :showTitle="false" :itemTpl="itemTpl" /> -->
      <v-tooltip :htmlContent="htmlContent"></v-tooltip>
      <v-coord type="theta" :radius="0.5" />
      <v-pie position="percent" :color="'type'" :label="label" :select="false" :vStyle="vstyle" :tooltip="tooltip" />
      <v-view :data="viewData" :scale="scale">
        <v-coord type="theta" :radius="0.85" :innerRadius="0.6 / 0.85" />
        <v-pie position="percent" :color="color" :label="label2" :select="false" :vStyle="vstyle" :tooltip="tooltip" />
      </v-view>
    </v-chart>
  </div>
</template>

<script>
//外部环状，中间饼状
const DataSet = require('@antv/data-set')
import { numberFormat, percentFormat } from '@/utils/filter'
export default {
  name: 'PilePie',
  props: {
    height: {
      type: Number,
      default: 400
    },
    chartTitle: {
      type: String,
      default: ''
    },
    padding: {
      type: Array,
      default: () => [50, 50, 50, 50]
    },
    chartData: {
      //数据样例[{ value: 12313, type: '高度', name: '高度', rate: 0.12 }]
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    chartData2: {
      //数据样例[{ value: 6515615, name: '近视人群', rate: 0.56 }]
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    scale: {
      type: Object,
      default: () => {
        return {
          dataType: 'percent',
          formatter: '.2%'
        }
      }
    },
    vstyle: {
      type: Object,
      default: () => {
        return {
          lineWidth: 1,
          stroke: '#fff'
        }
      }
    },
    label: {
      type: Array,
      default: () => {
        return ['type', { offset: -10 }]
      }
    },
    label2: {
      type: Array,
      default: () => {
        return [
          'name',
          {
            custom: true,
            htmlTemplate: (text, item) => {
              const box = `
              <div style="border:1px solid #ddd;border-radius:4px;text-align: center;font-size:10px;white-space: nowrap;padding:3px">
                <div>${text}</div>
                <div>${item.point.value}人</div>
                <div>${percentFormat(item.point.rate)}</div>
              </div>`
              return box
            }
          }
        ]
      }
    },
    // label2: { //若不需要富文本定义，仅是改变数据展示格式
    //   type: Array,
    //   default: () => {
    //     return [
    //       'name',
    //       {
    //         formatter: (val, item) => {
    //           console.log(123, item)
    //           return `${val}：${item.point.rate * 100}%（${item.point.value}）人`
    //         }
    //       }
    //     ]
    //   }
    // },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'name*percent',
          (item, percent) => {
            percent = (percent * 100).toFixed(2) + '%'
            return {
              name: item,
              value: percent
            }
          }
        ]
      }
    },
    itemTpl: {
      type: String,
      default: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    },
    color: {
      type: Array,
      default: () => {
        return ['name', ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5', '#8EE0A1', '#BAF5C4']]
      }
    }
  },
  data() {
    return {
      data: '',
      viewData: '',
      htmlContent: function htmlContent(title, items) {
        let html =
          '<div style="position: absolute;background:#fff;padding:5px;border-radius:5px;box-shadow:#ccc 0px 0px 3px 1px;display: flex;align-items: center;">'
        let point = `<div style="width: 8px;height: 8px;border-radius:50%;display: inline-block;margin-right:5px;background:${items[0].color}"></div>`
        let data = `<div style="display: inline-block">${items[0].name}：${numberFormat(
          items[0].point._origin.value * 1
        )}（${items[0].value}）</div>`
        return `${html}${point}${data}</div>`
      }
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
        dimension: 'type',
        as: 'percent'
      })
      this.data = dv.rows

      const viewDv = new DataSet.View().source(this.chartData2)
      viewDv.transform({
        type: 'percent',
        field: 'value',
        dimension: 'name',
        as: 'percent'
      })
      this.viewData = viewDv.rows
    }
  }
}
</script>
<style scoped lang="less">
@import './chart.less';
</style>
