<template>
  <div>
    <p class="chat-title" v-if="chartTitle">{{ chartTitle }}</p>
    <v-chart :forceFit="true" :height="400" :data="chartData" :padding="padding">
      <v-tooltip :htmlContent="htmlContent" />
      <v-axis data-key="value" :show="false" />
      <v-legend position="top-center"></v-legend>
      <v-coord direction="LB" type="rect" />
      <v-facet
        type="mirror"
        :fields="['type']"
        :autoSetAxis="false"
        :transpose="true"
        :showTitle="false"
        :padding="[0, 10, 0, 0]"
        :eachView="eachView"
      />
    </v-chart>
  </div>
</template>

<script>
import { numberFormat, percentFormat } from '@/utils/filter'
const eachView = function (view, facet) {
  let sum = facet.data.reduce(function (total, currentValue, currentIndex, arr) {
    return total + currentValue.value
  }, 0) //判断文字是黑的还是白的
  let average = sum / facet.data.length
  var facetIndex = facet.colIndex
  if (facetIndex === 0) {
    view.axis('name', {
      position: 'top',
      label: {
        textStyle: {
          fill: '#aaaaaa',
          fontSize: 12
        }
      },
      tickLine: {
        alignWithLabel: false,
        length: 0
      },
      line: {
        lineWidth: 0
      }
    })
  } else {
    view.axis('name', false)
  }
  var color = facetIndex === 0 ? '#1890ff' : '#2fc25b'
  view
    .interval()
    .position('name*value')
    .color(color)
    .size(30)
    .opacity(1)
    .label('value', function (val) {
      var offset = -3
      var shadowBlur = 2
      var textAlign = facetIndex === 1 ? 'end' : 'start'
      var fill = 'white'
      if (val < average) {
        offset = 10
        textAlign = facetIndex === 1 ? 'start' : 'end'
        fill = '#666666'
        shadowBlur = 0
      }
      return {
        //position: 'middle',
        offset: offset,
        textStyle: {
          fill: fill,
          shadowBlur: shadowBlur,
          shadowColor: 'rgba(0, 0, 0, .45)',
          textAlign: textAlign
        }
      }
    })
}
export default {
  name: 'MirrorBar',
  props: {
    chartTitle: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 400
    },
    padding: {
      type: Array,
      default: () => [-5, 10, 10, 60]
    },
    chartData: {
      //数据形如[{ name: '一年级',type：‘远视储备不足’，value：66.33 },{ name: '一年级',type：‘远视储备足够’，value：55 },{ name: '二年级',type：‘远视储备不足’，value：66 },{ name: '二年级',type：‘远视储备足够’，value：77 }]
      type: Array,
      default: () => {
        return []
      }
    },
    scale: {
      type: Array,
      default: () => {
        return [
          // {
          //   dataKey: 'value',
          //   nice: false,
          //   alias: '人数'
          // }
        ]
      }
    },
    htmlContent: {
      type: Function,
      default: () => {
        return null
      }
      // function htmlContent(title, items) {  //型如此的富文本
      //   console.log(title, items)
      //   let data = `<div style="display: inline-block">${items[0].title}${items[0].point.point.type}：${numberFormat(
      //     items[0].value * 1
      //   )}</div>`
      //   return `${data}</div>`
      // }
    }
  },
  data() {
    return {
      eachView
    }
  }
}
</script>
<style scoped lang="less">
@import './chart.less';
</style>
