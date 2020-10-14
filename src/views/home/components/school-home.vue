<template>
  <div>
    <!-- 顶部条件及展示 -->
    <div class="header-cond">
      <a-card>
        <a-row :gutter="[16, 8]" type="flex" justify="space-between" align="middle">
          <a-col :span="4">
            <drop-selector
              v-if="canSchoolSelect"
              v-model="headScr.school"
              :data="schoolList"
              label-key="orgName"
              value-key="orgId"
              dropdown-class-name="custom-z-index"
              style="width: 100%;"
              placeholder="请选择学校"
              @change="handleClick({ act: 12 })"
            />
          </a-col>
          <a-col :span="4" class="header-cond-pending-approval">待审批 {{ peopleNum | numberFormat }}人</a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 中部·请假情况 -->
    <div class="cont-case-report">
      <a-card>
        <template slot="title">
          <div class="header">
            <span>请假情况</span>
            <span class="descriptions">事假和病假人数统计</span>
          </div>
        </template>
        <a-row :gutter="[16, 8]" type="flex" justify="space-around" align="middle">
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ addUpNum | numberFormat }}</span>
              <p>累计请假人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ semesterNum | numberFormat }}</span>
              <p>本学期请假人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ momthNum | numberFormat }}</span>
              <p>本月请假人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ todayNum | numberFormat }}</span>
              <p>今日请假人数</p>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div class="cont-case-report">
      <a-card>
        <template slot="title">
          <div class="header">
            <span>因病缺课情况</span>
            <span class="descriptions">病假人数统计</span>
          </div>
        </template>
        <a-row :gutter="[16, 8]" type="flex" justify="space-around" align="middle">
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ addUpNum1 | numberFormat }}</span>
              <p>累计因病缺课人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ semesterNum1 | numberFormat }}</span>
              <p>本学期因病缺课人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ momthNum1 | numberFormat }}</span>
              <p>本月因病缺课人数</p>
            </div>
          </a-col>
          <a-col :span="4">
            <svg-icon type="iconbiaoqian" />
            <div>
              <span>{{ todayNum1 | numberFormat }}</span>
              <p>今日因病缺课人数</p>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 统计 -->
    <div>
      <a-card title="统计">
        <line-chart
          v-if="lineData.length"
          size="350px"
          :data="{
            columns: ['dateTime', 'todayNum'],
            rows: lineData
          }"
          :settings="{
            labelMap: {
              todayNum: '请假人数'
            },
            yAxisName: ['人数']
          }"
          :extend="chartExtend"
          :grid="chartGrid"
        ></line-chart>
        <!-- addUpNum: '累计请假人数',
              semesterNum: '本学期请假人数',
              momthNum: '本月请假人数', -->
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LineChart } from '_com'
import { lineData } from '../static' // 模拟列表数据

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

export default {
  components: {
    LineChart
  },
  data() {
    this.chartExtend = chartExtend
    this.chartGrid = chartGrid
    return {
      headScr: {
        school: undefined
      },
      schoolList: [],
      lineData: [],
      peopleNum: 55,
      addUpNum: 3520,
      semesterNum: 2120,
      momthNum: 758,
      todayNum: 48,
      addUpNum1: 1728,
      semesterNum1: 1285,
      momthNum1: 362,
      todayNum1: 108
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
  .ant-col {
    text-align: center;
    display: flex;
    justify-items: center;
    font-size: 30px;
    justify-content: left;
    align-items: center;
    color: #6a76dd;
    div {
      padding-left: 15px;
    }
    span {
      .textStyle();
    }
    p {
      .textStyle(16px, @tint-black);
      .marginB(0);
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
