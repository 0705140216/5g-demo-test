<template>
  <div>
    <p class="chat-title" v-if="chartTitle">{{ chartTitle }}</p>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" :padding="padding">
      <v-tooltip />
      <v-axis data-key="rate" :label="label" />
      <v-legend />
      <v-stack-bar position="name*rate" :color="color" :label="label2" :size="size" />
    </v-chart>
  </div>
</template>
<script>
//饼状图（环状图）
const DataSet = require('@antv/data-set')
export default {
  name: 'Bar',
  props: {
    dataKey: {
      //柱子类型的区分key，传来数据的第一个key
      type: String,
      default: 'type'
    },
    chartTitle: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: 400
    },
    fields: {
      //横坐标的键值。形如[桐乡,海宁]
      type: Array,
      default: () => {
        return []
      }
    },
    padding: {
      type: Array,
      default: () => [30, 10, 80, 50]
    },
    chartData: {
      //数据形如[{ type: '男生',桐乡：56.23，海宁：66.33 },{ type: '女生',桐乡：56.23，海宁：66.33 }]
      type: Array,
      default: () => {
        return []
      }
    },
    adjust: {
      type: Array,
      default: () => {
        return [
          {
            type: 'dodge',
            marginRatio: 1 / 32
          }
        ]
      }
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
      //每根柱子上要显示的数据
      //形如是['rate',{position: 'top',offset: 10,textStyle: {fill: '#000'}}]
      type: Array,
      default: () => {
        return []
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
      type: Array,
      default: () => {
        return ['type', ['#3AA1FF', '#55CE79', '#FCD540', '#4B588D', '#9B66E6', '#3FCECE']]
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
        key: 'name',
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
