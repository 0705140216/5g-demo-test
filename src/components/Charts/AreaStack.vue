<template>
  <div>
    <p class="chat-title" v-if="chartTitle">{{ chartTitle }}</p>
    <v-chart :forceFit="true" :height="height" :data="chartData" :scale="scale" :padding="padding">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line position="abscissa*ordinate" :size="2" :color="color" adjust="stack" />
      <v-stack-area position="abscissa*ordinate" :color="color" />
    </v-chart>
  </div>
</template>

<script>
//面积堆叠图
export default {
  name: 'LineChart',
  props: {
    height: {
      type: Number,
      default: 400
    },
    width: {
      type: Number,
      default: 450
    },
    chartTitle: {
      type: String,
      default: ''
    },
    padding: {
      type: Array,
      default: () => [40, 40, 60, 40]
    },
    chartData: {
      //数据形如是[{abscissa: "市本级",name: "幼儿园"，ordinate: 0},{abscissa: "南湖区",name: "幼儿园"，ordinate: 20.24},{abscissa: "经开区",name: "幼儿园"，ordinate: 20.24},{abscissa: "经开区",name: "幼儿园"，ordinate: 20.24}]
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    scale: {
      // 数据图形映射设置
      type: Array,
      default: () => {
        return []
      }
    },
    color: {
      type: Array,
      default: () => {
        return ['name']
      }
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
