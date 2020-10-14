import Vue from 'vue'
import VeLine from 'v-charts/lib/line.common' // 折线
import VeHistogram from 'v-charts/lib/histogram.common' // 柱状
import VeRing from 'v-charts/lib/ring.common' // 环形
import VePie from 'v-charts/lib/pie.common' // 饼形
import VeBar from 'v-charts/lib/bar.common' // 条形
import VeFunnel from 'v-charts/lib/funnel.common' // 漏斗图

Vue.component(VeLine.name, VeLine)
Vue.component(VeHistogram.name, VeHistogram)
Vue.component(VeRing.name, VeRing)
Vue.component(VePie.name, VePie)
Vue.component(VeBar.name, VeBar)
Vue.component(VeFunnel.name, VeFunnel)
