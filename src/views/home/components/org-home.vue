<template>
  <div>
    <!-- 统计 -->
    <div class="cont-case-report">
      <a-card title="统计">
        <line-chart
          v-if="lineData.length"
          size="350px"
          :data="{
            columns: ['dateTime', 'momthNum'],
            rows: lineData
          }"
          :settings="{
            labelMap: {
              momthNum: '请假人数'
            },
            yAxisName: ['人数']
          }"
          :extend="chartExtend"
          :grid="chartGrid"
        ></line-chart>
      </a-card>
    </div>

    <div class="cont-case-report stat-report">
      <a-card>
        <!-- <template slot="title">
          <div class="header">
            <span>因病缺课情况</span>
            <span class="descriptions">病假人数统计</span>
          </div>
        </template> -->
        <a-row :gutter="[16, 8]" type="flex" justify="space-around" align="middle">
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ addUpNum | numberFormat }}</span>
              <p>总病假人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ semesterNum | numberFormat }}</span>
              <p>男生病假人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ momthNum | numberFormat }}</span>
              <p>女生病假人数</p>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div class="cont-case-report">
      <a-card>
        <!-- <template slot="title">
          <div class="header">
            <span>因病缺课情况</span>
            <span class="descriptions">病假人数统计</span>
          </div>
        </template> -->
        <a-row :gutter="[16, 8]" type="flex" justify="space-around" align="middle">
          <a-col :span="12">
            <a-card title="按学段统计">
              <ul class="stat-progress">
                <li v-for="(item, index) in sectionData" :key="index" class="mb">
                  <span>{{ item.name }}</span>
                  <a-progress :percent="item.count" :format="percent => `${percent}1人`" />
                </li>
              </ul>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="按病因统计">
              <ul class="stat-progress">
                <template v-for="(item, index) in causeList">
                  <li v-if="item.count" :key="index">
                    <span>{{ item.name }}</span>
                    <a-progress :percent="item.count" :format="percent => `${percent}2人`" />
                  </li>
                </template>
              </ul>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <div class="cont-case-report">
      <a-card title="按地区统计">
        <a-radio-group default-value="" button-style="solid" size="small">
          <a-radio-button v-for="(item, index) in causeList" :key="index" :value="item.id">
            {{ item.name }}
          </a-radio-button>
        </a-radio-group>
        <histogram-chart
          v-if="singleBarData.length"
          :data="{
            columns: ['name', 'cariesCount'],
            rows: singleBarData
          }"
          :settings="{
            yAxisName: ['人数'],
            labelMap: { cariesCount: '缺课人数' },
            label: {
              show: true,
              position: 'top',
              color: '#666',
              formatter: ({ value }) => value + '人'
            }
          }"
          :extend="barExtend"
          :grid="chartGrid"
        ></histogram-chart>
      </a-card>
    </div>
    <div class="cont-case-report">
      <a-card title="按学校统计">
        <a-radio-group default-value="" button-style="solid" size="small">
          <a-radio-button v-for="(item, index) in causeList" :key="index" :value="item.id">
            {{ item.name }}
          </a-radio-button>
        </a-radio-group>
        <histogram-chart
          v-if="schoolBarData.length"
          :data="{
            columns: ['name', 'cariesCount'],
            rows: schoolBarData
          }"
          :settings="{
            yAxisName: ['人数'],
            labelMap: { cariesCount: '缺课人数' },
            label: {
              show: true,
              position: 'top',
              color: '#666',
              formatter: ({ value }) => value + '人'
            }
          }"
          :extend="barExtend"
          :grid="chartGrid"
        ></histogram-chart>
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LineChart, HistogramChart } from '_com'
import { lineData, singleBarData, schoolBarData, sectionData, causeList } from '../static' // 模拟列表数据

const chartExtend = {
  legend: {
    show: true,
    x: 'right',
    y: 'top',
    itemWidth: 8, // 图例大小
    icon: 'circle', // 图例的形状，一个圆
    orient: 'horizontal'
  },
  xAxis: {
    axisLabel: {
      rotate: 15
    }
  }
}
const chartGrid = {
  show: true,
  top: 53,
  bottom: 0,
  left: 0,
  right: 0,
  containLabel: true,
  backgroundColor: 'transparent',
  borderColor: 'transparent'
}

const barExtend = {
  xAxis: {
    axisLabel: {
      rotate: 15,
      // 超过10字换行
      formatter: function(params) {
        let temStr = ''
        // debugger
        // const providNum = 10 // 截取长度
        // if (params.length > providNum) {
        //   const rowNum = Math.ceil(params.length / providNum)
        //   for (let inx = 0; inx < rowNum; inx++) {
        //     if (inx == rowNum - 1) {
        //       temStr += params.substring(inx * providNum)
        //     } else {
        //       temStr += params.substring(inx * providNum, (inx + 1) * providNum) + '\n'
        //     }
        //   }
        // }
        return temStr || params
      }
    }
  }
}

export default {
  components: {
    LineChart,
    HistogramChart
  },
  data() {
    this.chartExtend = chartExtend
    this.chartGrid = chartGrid
    this.barExtend = barExtend
    this.causeList = causeList
    this.sectionData = sectionData
    return {
      headScr: {
        school: undefined
      },
      schoolList: [],
      lineData: [],
      singleBarData: [],
      schoolBarData: [],
      peopleNum: 55,
      addUpNum: 3520,
      semesterNum: 2320,
      momthNum: 1220
    }
  },
  computed: {
    ...mapState({
      orgProperty: state => state.user.orgInfo.orgProperty,
      orgId: state => state.user.orgInfo.orgId,
      roleType: state => state.user.roles.roleType
    }),
    canSchoolSelect() {
      return this.orgProperty == 20 && [10, 20].includes(this.roleType) // 学校下拉框
    }
  },
  created() {
    if (this.orgProperty == 20) this.headScr.school = this.orgId // 集团学校默认本校
    this.getSelectList()
  },
  methods: {
    getSelectList() {
      // ...
      this.schoolList = [
        { orgId: '224285397914628096', orgName: '第二附属中学' },
        { orgId: '221286180665360384', orgName: '天都小学' }
      ]
      this.censusData()
    },
    censusData() {
      // ...
      setTimeout(() => {
        this.lineData = lineData
        this.singleBarData = singleBarData
        this.schoolBarData = schoolBarData
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.textStyle(@fontSize: 32px, @color: @light-black) {
  font-size: @fontSize;
  color: @color;
}
.header-cond,
.cont-case-report,
.cont-special-report {
  .marginB(16px);
}
.header-cond {
  &-pending-approval {
    .textStyle(24px);
  }
}
.cont-case-report {
  &.stat-report {
    .ant-col {
      display: flex;
      justify-items: center;
      font-size: 30px;
      justify-content: left;
      align-items: center;
      div {
        padding-left: 15px;
      }
    }
  }
  .ant-col {
    text-align: center;

    span {
      .textStyle();
    }
    p {
      .textStyle(16px, @tint-black);
      .marginB(0);
    }
    .stat-progress {
      li {
        display: flex;
        &.mb {
          margin-bottom: 14px;
        }
        span {
          font-size: 14px;
          width: 120px;
          text-align: left;
        }
      }
    }
  }
}
.cont-special-report {
  /deep/ .ant-card-body {
    text-align: center;
    .textStyle(24px);
  }
}
/deep/ .ant-card-head-title {
  &::before {
    display: none;
  }
  .header {
    display: flex;
    .descriptions {
      margin-left: 20px;
      color: #aaa;
      font-size: 12px;
      line-height: 20px;
      padding-top: 8px;
    }
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background: #50cafa;
      border-radius: 2px;
      margin-right: 10px;
      position: relative;
      top: 8px;
    }
  }
}
</style>
