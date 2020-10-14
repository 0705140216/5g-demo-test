<template>
  <div ref="pieChart" :style="`height:${height}`"></div>
</template>
<script>
import eCharts from 'echarts/lib/echarts'
import 'echarts/src/chart/pie'
import 'echarts/lib/component/title'
import { colors } from '@/core/constants'

export default {
  name: 'PieMultiChart', // 多圆饼图
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          columns: [],
          rows: []
        }
      }
    },
    level: {
      // 双层字段配置 例：[['a','b'],['c']]  其中 a、b为内圆饼维度  c为外环维度
      type: Array,
      default: () => {
        return []
      }
    },
    dimension: {
      // 维度字段名，用于重组数据
      type: String,
      default: 'name'
    },
    colors: {
      type: Array,
      default: () => colors
    },
    title: {
      // 标题
      type: Object,
      default: () => ({})
    },
    outCircle: {
      // 外圆环series配置
      type: Object,
      default: () => ({})
    },
    inCircle: {
      // 内圆饼series配置
      type: Object,
      default: () => ({})
    },
    otherSettings: {
      // 其他配置
      type: Object,
      default: () => ({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}人 ({d}%)'
        }
      })
    },
    width: {
      type: String,
      default: '400px'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      options: Object.freeze({
        inCircle: {
          name: '',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            position: 'inner'
          },
          labelLine: {
            show: false
          }
        },
        outCircle: {
          name: '',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            formatter: '{a|{b}}\n{hr|}\n {b|{c}}人\n{hr|}\n {b|{d}%} ',
            backgroundColor: '#fff',
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 4,
            padding: [3, 3, 3, 3],
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center'
              },
              hr: {
                height: 0,
                borderWidth: 0.5,
                borderColor: '#ccc',
                marginBottom: 2,
                width: '100%',
                backgroundColor: '#ccc'
              },
              b: {
                lineHeight: 25
              }
            }
          }
        },
        title: {
          show: false,
          text: '',
          subtext: '',
          textAlign: 'center',
          bottom: 20,
          textStyle: {
            color: '#555',
            fontSize: 14
          }
        }
      }),
      inCircleData: [], // 内圆饼数据
      outCircleData: [] // 外圆环数据
    }
  },
  computed: {
    outCircleAs() {
      return Object.assign({}, this.options.outCircle, this.outCircle)
    },
    inCircleAs() {
      return Object.assign({}, this.options.inCircle, this.inCircle)
    },
    titleAs() {
      return Object.assign({}, this.options.title, this.title)
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.initData(this.level, val)
      }
    }
  },
  mounted() {
    this.initData(this.level, this.data)
  },
  methods: {
    creatChart() {
      const options = {
        color: this.colors,
        title: this.titleAs,
        series: [
          { ...this.inCircleAs, data: this.inCircleData },
          { ...this.outCircleAs, data: this.outCircleData }
        ],
        ...this.otherSettings
      }
      const myChart = eCharts.init(this.$refs.pieChart)
      myChart.setOption(options)
    },
    initData(level = [], { rows } = {}) {
      this.inCircleData = []
      this.outCircleData = []
      if (level.length) {
        level.forEach((levelItems, index) => {
          levelItems.forEach(item => {
            const newObj = rows.find(i => i[this.dimension] === item)
            index === 0 ? this.inCircleData.push(newObj) : this.outCircleData.push(newObj)
          })
        })
      }
      this.creatChart()
    }
  }
}
</script>
