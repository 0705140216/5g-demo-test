<template>
  <happy-scroll hide-horizontal size="6" :min-length-v="20" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </happy-scroll>
</template>

<script>
// *****属性*****  描述:   类型 / 默认值 / 可选值
// color: 滚动条颜色： String / rgba(51,51,51,0.2)
// size: 滚动条大小:  Number|String / 4
// min-length-h (*new): 设置横向滚动条最小的长度  Number / 40 (单位：px)
// min-length-v (*new): 设置竖向滚动条最小的长度  Number / 40 (单位：px)
// scroll-top: 在组件mounted之后，设置容器距离顶部的距离，相当于element.scrollTop  Number|String / 0
// scroll-left: 在组件mounted之后，设置容器距离左边的距离,相当于element.scrollLeft Number|String / 0
// hide-vertical: 隐藏竖向滚动条   Boolean / false
// hide-horizontal: 隐藏横向滚动条  Boolean / false  设置为true可以提高性能
// resize: 表示开启监听容器大小变化  Boolean / false (如果你的容器大小是变化的(高度或者宽度可能随时发生变化的情况)，可使用resize来开启对容器大小变化的监听，当容器的宽高大于你设定的宽高时，会自动出现滚动条，反正会自动隐藏滚动条)
// smaller-move-h、smaller-move-v: 表示当容器变小时，滚动条移动的方向(当resize=true时，此配置才有效) String / '' / start|end
// bigger-move-h、bigger-move-v: 表示当容器大小变大时，滚动条移动的方向(同上)  String / '' / start|end
// left: 设置竖向滚动条依靠在左边   Boolean / false
// top: 设置横向滚动条依靠在上边   Boolean / false
// throttle: 设置鼠标拖动滚动条的节流时间，如果没有特殊的要求不建议修改此值  Number / 14(单位毫秒)
// *****事件******
// horizontal-start: 参数：scrollLeft 在horizontal-start事件下，scrollLeft始终为0。监听横向滚动条滚动到头部的事件。当scroll-left = 0时会触发该事件。
//                    <happy-scroll @horizontal-start="yourHandler">
// horizontal-end： 参数：scrollLeft 监听横向滚动条滚动到尾部的事件
// vertical-start： 参数: scrollTop 在vertical-start事件下，scrollTop始终为0, 说明 监听竖向滚动条滚动到头部的事件。当scroll-top = 0时会触发该事件。
// vertical-end: 参数scrollTop 监听竖向滚动条滚动到尾部的事件
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  name: 'HappyScrollbar',
  components: { HappyScroll }
}
</script>

<style style="less" scoped>
/* /deep/.happy-scroll-content {
  width: 100%;
} */
</style>
