<template>
  <div>
    <p v-if="chartTitle" class="chat-title">{{ chartTitle }}</p>
    <v-chart :force-fit="true" :height="height" :data="chartData" :padding="padding">
      <v-tooltip :item-tpl="itemTpl" />
      <v-axis data-key="rate" :label="label" />
      <v-interval position="name*rate" :label="labelInterval" :opcaity="1" :size="size" :color="color"></v-interval>
      <v-bar position="name*rate" :size="size" :color="color" />
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'SingleBar',
  props: {
    height: {
      type: Number,
      default: 400
    },
    padding: {
      type: Array,
      default: () => [15, 40, 50, 40]
    },
    chartData: {
      // 数据形如是[{name:小学,rate:56.23},{name:初中,rate:88.23}]
      type: Array,
      default: () => []
    },
    chartTitle: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: null
    },
    color: {
      type: String,
      default: '#3AA1FF'
    },
    scale: {
      // 通过alias自定义tooltips中的value  也可通过itemTpl
      // [{dataKey: 'rate',alias: '近视率'}]
      type: Array,
      default: () => {
        return null
      }
    },
    label: {
      // 纵坐标label设置
      type: Object,
      default: () => {
        return {
          formatter: function formatter(val) {
            return val
          }
        }
      }
    },
    itemTpl: {
      // 简单改变tooltip
      type: String,
      default: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    },
    labelInterval: {
      // 柱状图顶上的数据,形如
      // [
      //     'value',
      //     {
      //       useHtml: true,
      //       htmlTemplate: function htmlTemplate(text, item) {
      //         console.log(text, item)
      //         return `<span style="font-size:10px">${item._origin.rate}%</span>`
      //       }
      //     }
      //   ]
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style scoped lang="less">
@import './chart.less';
</style>
