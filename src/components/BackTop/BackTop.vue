<template>
  <div class="goTop" :style="{ opacity: btnFlag ? 100 : 0 }">
    <ul class="btn-ul">
      <li
        v-for="item in btnList"
        :key="item.id"
        @mouseenter="hoverMouseenter(item, false)"
        @mouseleave="hoverMouseenter(item, true)"
        @click="tabClick(item.id)"
      >
        <div class="btn-all btn-common">
          <!-- <i v-if="item.flag" class="icon iconfont" :class="item.icon"></i> -->
          <a-icon v-if="item.flag" :type="item.icon" />
          <span v-else>{{ item.text }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BackTop',
  props: {
    parent: {
      type: String,
      default: ''
    },
    btnList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      btnFlag: false,
      timer: null,
      scrollTop: 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop, true)
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollToTop, true)
  },
  methods: {
    // 点击图片回到顶部方法，加计时器是为了过渡顺滑
    backTop() {
      const that = this
      this.timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 2)
        if (this.parent) {
          document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        } else {
          document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        }
        if (that.scrollTop === 0) {
          clearInterval(this.timer)
        }
      }, 16)
    },
    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop() {
      const that = this
      let scrollTop = ''
      if (this.parent) {
        scrollTop = document.documentElement.scrollTop
      } else {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      }

      that.scrollTop = scrollTop
      if (that.scrollTop > 250) {
        that.btnFlag = true
      } else {
        that.btnFlag = false
      }
    },
    hoverMouseenter(item, flag) {
      item.flag = flag
    },
    tabClick(id) {
      switch (+id) {
        case 1: // 打印
          this.$emit('print')
          break
        case 2: // 下载
          this.$emit('down')
          break
        case 3: // 回顶部
          this.backTop()
          break
      }
    }
  }
}
</script>

<style lang="less">
.goTop {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 999;
  cursor: pointer;
  opacity: 100;
  transition: opacity 0.5s ease-in-out;
  .btn-ul {
    display: flex;
    flex-direction: column;
    li {
      margin-top: 5px;
    }
    .btn-common {
      width: 40px;
      height: 40px;
      background-color: #00a2ad;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 14px;
      i {
        color: #fff;
        font-size: 20px;
      }
    }
  }
}
</style>
