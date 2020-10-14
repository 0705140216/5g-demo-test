<template>
  <div>
    <v-chart :forceFit="forceFit" :height="height" :data="data" :padding="padding">
      <v-coord type="rect" direction="LT" />
      <v-tooltip />
      <v-legend />
      <v-axis data-key="value" position="right" />
      <v-axis data-key="name" :label="label" />
      <v-bar position="name*value" :color="color" :adjust="adjust" :label="label2" :size="size" />
    </v-chart>
  </div>
</template>

<script>
const DataSet = require('@antv/data-set')
export default {
  name: 'CrossBar',
  props: {
    height: {
      type: Number,
      default: 400
    },
    forceFit: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: null
    },
    chartData: {
      type: Array,
      default: () => {
        return []
      }
    },
    padding: {
      type: Array,
      default: () => [30, 10, 80, 60]
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    label: {
      type: Object,
      default: () => {
        return { offset: 12 }
      }
    },
    adjust: {
      type: Array,
      default: () => {
        return [{ type: 'dodge', marginRatio: 1 / 32 }]
      }
    },
    label2: {
      //每根柱子上要显示的数据
      //形如是[
      // ['rate',{position: 'top',offset: 10,textStyle: {fill: '#000'}}]
      type: Array,
      default: () => {
        return ['value', { position: 'top', offset: 10, textStyle: { fill: '#000' } }]
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
        key: 'type',
        value: 'value'
      })
      this.data = dv.rows
    }
  }
}
</script>
<style scoped lang="less">
@import './chart.less';
</style>
