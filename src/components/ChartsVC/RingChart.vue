<template>
  <ve-ring
    ref="ringChart"
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
  </ve-ring>
</template>
<script>
import 'echarts/lib/component/title'
import { colors } from '@/core/constants'

export default {
  name: 'RingChart',
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
      default: '250px'
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
          radius: [50, 80],
          offsetY: 120,
          label: {
            show: true,
            position: 'center',
            formatter: ({ percent, dataIndex }) => {
              if (dataIndex == 0) {
                return percent + '%'
              } else {
                return ''
              }
            },
            color: '#666',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 16
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
  created() {},
  mounted() {
    this.$nextTick(() => {
      if (
        this.$refs.ringChart.echarts &&
        (this.$refs.ringChart.echarts.getWidth() === 0 || this.$refs.ringChart.echarts.getHeight() === 0)
      ) {
        this.$refs.ringChart.echarts.resize()
      }
    })
  }
}
</script>
