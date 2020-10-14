<template>
  <ve-pie
    ref="pieChart"
    :data="data"
    :colors="colors"
    :settings="settingsAs"
    :grid="gridAs"
    :title="titleAs"
    :extend="extendAs"
    :height="height"
    :width="width"
    v-bind="$attrs"
  >
    <slot />
  </ve-pie>
</template>
<script>
import 'echarts/lib/component/title'
import { colors } from '@/core/constants'

export default {
  name: 'PieChart',
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
      default: '300px'
    },
    width: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      options: Object.freeze({
        grid: {
          show: true,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        },
        title: {
          show: false,
          text: '',
          subtext: '',
          x: 'center',
          bottom: 20,
          textStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        extend: {
          legend: {
            show: false,
            x: 'center',
            y: 'bottom',
            orient: 'vertical'
          }
        },
        settings: {
          radius: 80,
          offsetY: 130,
          label: {
            show: true,
            position: 'outside',
            color: '#666',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 14
          }
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
        this.$refs.pieChart.echarts &&
        (this.$refs.pieChart.echarts.getWidth() === 0 || this.$refs.pieChart.echarts.getHeight() === 0)
      ) {
        this.$refs.pieChart.echarts.resize()
      }
    })
  }
}
</script>
