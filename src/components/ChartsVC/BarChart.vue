<template>
  <ve-bar
    ref="barChart"
    :data="data"
    :colors="colors"
    :settings="settingsAs"
    :grid="gridAs"
    :title="titleAs"
    :extend="extendAs"
    :height="height"
    v-bind="$attrs"
  >
    <slot />
  </ve-bar>
</template>
<script>
import 'echarts/lib/component/title'
import { colors } from '@/core/constants'

export default {
  name: 'BarChart',
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
    colors: {
      type: Array,
      default: () => colors
    },
    title: {
      type: Object,
      default: () => ({})
    },
    extend: {
      type: Object,
      default: () => ({})
    },
    settings: {
      type: Object,
      default: () => ({})
    },
    grid: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  data() {
    return {
      options: Object.freeze({
        grid: {
          show: true,
          top: 80,
          bottom: 20,
          left: '3%',
          right: '3%',
          containLabel: true,
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        },
        title: {
          show: false,
          text: '',
          subtext: '',
          x: 'left',
          top: 20,
          textStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        extend: {},
        settings: {
          xAxisType: ['normal'],
          yAxisType: 'category',
          label: {
            // 设置图形上的文本标签样式
            show: true,
            position: 'top',
            color: '#666',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 14
          },
          labelMap: {}, // 设置指标的别名，同时作用于提示框和图例
          legendName: {} // 设置图表上方图例的别名
        }
      })
    }
  },
  computed: {
    extendAs() {
      return Object.assign({}, this.options.extend, this.extend)
    },
    titleAs() {
      return Object.assign({}, this.options.title, this.title)
    },
    settingsAs() {
      return Object.assign({}, this.options.settings, this.settings)
    },
    gridAs() {
      return Object.assign({}, this.options.grid, this.grid)
    }
  },
  mounted() {
    // 对于首次加载的隐藏页图表，进行宽高判断，出发重新渲染
    this.$nextTick(() => {
      if (
        this.$refs.barChart.echarts &&
        (this.$refs.barChart.echarts.getWidth() === 0 || this.$refs.barChart.echarts.getHeight() === 0)
      ) {
        this.$refs.barChart.echarts.resize()
      }
    })
  }
}
</script>
