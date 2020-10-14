<template>
  <ve-line
    ref="lineChart"
    :data="data"
    :colors="colors"
    :settings="settingsAs"
    :title="titleAs"
    :extend="extendAs"
    :height="size"
    v-bind="$attrs"
  >
    <slot />
  </ve-line>
</template>
<script>
import 'echarts/lib/component/title'
import { colors } from '@/core/constants'

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
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
    size: {
      type: String,
      default: '250px'
    }
  },
  data() {
    return {
      origin: Object.freeze({
        title: {
          show: true,
          text: '',
          subtext: '',
          x: 'left',
          top: 20,
          textStyle: {
            color: '#333',
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
        this.$refs.lineChart.echarts &&
        (this.$refs.lineChart.echarts.getWidth() === 0 || this.$refs.lineChart.echarts.getHeight() === 0)
      ) {
        this.$refs.lineChart.echarts.resize()
      }
    })
  }
}
</script>
