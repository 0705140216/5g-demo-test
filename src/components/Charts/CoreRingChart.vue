<template>
  <div>
    <v-chart
      v-if="showRingChart"
      :force-fit="true"
      :width="130"
      :height="130"
      :data="data"
      :scale="pieScale"
      padding="auto"
    >
      <v-tooltip :show-title="false" :data-key="`${dimension}*percent`" />
      <v-axis />
      <!-- :v-style="pieStyle" 指定文本/线条样式, color="#111" 指定环形样式  :label="labelConfig" 文本描述 -->
      <!-- https://www.yuque.com/rs385i/yzbt72/gq1y6k -->
      <v-pie position="percent" :color="dimension" />
      <v-coord type="theta" :radius="0.99" :inner-radius="0.6" />
      <v-guide v-if="htmlGuideHtml" type="html" :position="htmlGuidePosition" :html="htmlGuideHtml"></v-guide>
    </v-chart>

    <div v-else class="ring">
      <div v-html="htmlGuideHtml"></div>
    </div>
  </div>
</template>

<script>
import { DataSet } from '@antv/data-set'
export default {
  name: 'PieRingChart',
  props: {
    pieData: {
      type: Array,
      default: () => {
        return []
      }
    },
    pieScale: {
      // 数据图形映射设置
      type: Array,
      default: () => {
        return [
          {
            dataKey: 'percent',
            min: 0,
            max: 1,
            formatter: '.2%' // 数据映射为小数点后几位
          }
        ]
      }
    },
    pieColor: {
      type: String,
      default: '#01A1AC'
    },
    field: {
      // 数量
      type: String,
      default: ''
    },
    dimension: {
      // 字段
      type: String,
      default: ''
    },
    htmlGuideHtml: {
      // 中心展示数据设置
      type: String,
      default: `<span></span>`
    }
  },
  data() {
    this.htmlGuidePosition = ['50%', '50%']
    this.labelConfig = [
      'percent',
      {
        formatter: (val, item) => {
          return item.point.item + ': ' + val
        }
      }
    ]
    return {
      data: []
    }
  },
  computed: {
    showRingChart() {
      return this.data.filter(i => i.screen).length
    }
  },
  watch: {
    pieData: {
      handler() {
        this.handleData()
      },
      deep: true
    }
  },
  mounted() {
    this.handleData()
  },
  methods: {
    handleData() {
      const dv = new DataSet.View().source(this.pieData)
      dv.transform({
        type: 'percent',
        field: this.field,
        dimension: this.dimension,
        as: 'percent'
      })
      this.data = dv.rows
    }
  }
}
</script>

<style lang="less" scoped>
.ring {
  .size(130px, 130px);
  border: 15px solid grey;
  border-radius: 50%;
  position: relative;
  > div {
    .fxied-center();
    white-space: nowrap;
  }
}
</style>
