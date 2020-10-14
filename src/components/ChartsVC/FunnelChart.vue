<template>
  <ve-funnel
    ref="funnelChart"
    :data="data"
    :colors="colors"
    :title="titleAs"
    :width="width"
    :height="height"
    :extend="extendAs"
    :settings="settingsAs"
    v-bind="$attrs"
  >
    <slot />
  </ve-funnel>
</template>

<script>
import 'echarts/lib/component/title'
import 'v-charts/lib/style.css'
import { colors } from '@/core/constants'
export default {
  name: 'FunnelChart',
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
      default: () => {
        return {}
      }
    },
    extend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    settings: {
      type: Object,
      default: () => {
        return {}
      }
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      origin: Object.freeze({
        title: {
          show: true,
          text: '',
          subtext: '',
          x: 'center',
          top: 0,
          textStyle: {
            color: '#FFF',
            fontSize: 16
          }
        },
        extend: {
          legend: {
            show: false,
            x: 'right',
            y: 'top',
            orient: 'horizontal',
            textStyle: {
              color: '#FFF',
              fontSize: 12
            }
          },
          series: {
            label: {
              normal: {
                show: true
              }
            }
          }
        },
        settings: {}
      })
    }
  },
  computed: {
    extendAs() {
      return Object.assign({}, this.origin.extend, this.extend)
    },
    titleAs() {
      return Object.assign({}, this.origin.title, this.title)
    },
    settingsAs() {
      return Object.assign({}, this.origin.settings, this.settings)
    }
  },
  mounted() {
    // 对于首次加载的隐藏页图表，进行宽高判断，出发重新渲染
    this.$nextTick(() => {
      if (
        this.$refs.funnelChart.echarts &&
        (this.$refs.funnelChart.echarts.getWidth() === 0 || this.$refs.funnelChart.echarts.getHeight() === 0)
      ) {
        this.$refs.funnelChart.echarts.resize()
      }
    })
  }
}
</script>

<style scoped></style>
