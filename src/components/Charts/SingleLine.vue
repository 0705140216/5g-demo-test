<template>
  <div>
    <p class="chat-title" v-if="chartTitle">{{ chartTitle }}</p>
    <v-chart :forceFit="true" :height="height" :data="chartData" :scale="scale" :padding="padding">
      <v-tooltip :itemTpl="itemTpl" />
      <v-axis data-key="value" :label="label" />
      <v-line position="name*value" :color="color" />
      <v-point position="name*value" shape="circle" :label="label2" :color="color" />
    </v-chart>
  </div>
</template>

<script>
//单折线图
export default {
  name: 'SingleLine',
  props: {
    height: {
      type: Number,
      default: 400
    },
    chartTitle: {
      type: String,
      default: ''
    },
    chartData: {
      //形如是[{ name: 大一, value: 55 }，{ name: 大二, value: 66}]
      type: Array,
      default: () => {
        return []
      }
    },
    padding: {
      type: Array,
      default: () => [45, 45, 45, 45]
    },
    itemTpl: {
      //若想自定义name 并加上百分号
      // <li><span style="background-color:{color};" class="g2-tooltip-marker"></span>近视率: {value}%</li>
      type: String,
      default: ''
    },
    label: {
      //纵坐标label设置
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
    label2: {
      type: Array,
      default: () => {
        return []
        //  [    //若要在每个点上加 value + %
        //     'name*value',
        //     function (date, value) {
        //       return (value * 1).toFixed(2) + '%'
        //     },
        //     {
        //       textStyle: {
        //         fill: '#7a7a7a',
        //         fontSize: 10,
        //         stroke: 'white',
        //         lineWidth: 2,
        //         fontWeight: 300
        //       }
        //     }
        //   ]
      }
    },
    scale: {
      //依据声明的键值，重新显示全部该键值数据  例如下 要将全部数据加上 %
      //[{dataKey: 'rate',min: 0,formatter: function formatter(val) {return (val * 1).toFixed(2) + '%'}}]
      type: Array,
      default: () => {
        return []
      }
    },
    color: {
      type: String,
      default: '#3AA1FF'
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
