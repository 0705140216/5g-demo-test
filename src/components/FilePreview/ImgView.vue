<template>
  <a-modal
    ref="imgWrapper"
    centered
    :visible.sync="dialogVisible"
    :mask-closeable="false"
    :width="width"
    :footer="null"
    class="imgWrapper"
    @cancel="close"
  >
    <a-spin :spinning="loading">
      <div id="imgBig" ref="imgBig" class="imgBig" style="width: 100%;" :style="styleObj">
        <canvas
          id="canvas"
          ref="canvas"
          @mousewheel="canvasMouseWheel"
          @wheel="canvasMouseWheel"
          @mousedown="canvasMouseDown"
          @mouseup="canvasMouseUp"
          @mouseover="canvasMouseOver"
          @mousemove="canvasMouseMove"
        />
        <div class="btnOpera">
          <ul class="inside">
            <li
              v-for="ele in btnList"
              :key="ele.id"
              @mouseenter="ele.isText = true"
              @mouseleave="ele.isText = false"
              @click="btnClick(ele.id)"
            >
              <span v-if="ele.isText" class="text">
                {{ ele.id === 4 ? (isFullScreen ? '小屏' : '全屏') : ele.text }}
              </span>
              <svg-icon
                v-else
                :class="ele.icon"
                :type="ele.id === 4 ? (isFullScreen ? 'iconquxiaoquanping' : 'iconquanping') : ele.icon"
              />
            </li>
          </ul>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  props: {
    viewSrc: {
      type: String,
      default: ''
    },
    imgVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      isFullScreen: true,
      styleObj: {
        minHeight: 0
      },
      zoom: {
        cxt: '',
        imgScale: 1,
        img: '',
        imgX: 0,
        imgY: 0,
        imgW: '',
        imgH: '',
        cimgW: '',
        cimgW2: '',
        cimgH: '',
        cimgH2: '',
        currentRate: 0,
        /** 当前的旋转角度*/
        mouseDownLocation: '',
        isMouseDown: false
      },
      btnList: [
        { id: 1, text: '上一张', icon: 'iconleft', isText: false },
        { id: 2, text: '放大', icon: 'iconfangda', isText: false },
        { id: 3, text: '旋转', icon: 'iconicon_rotate', isText: false },
        { id: 4, text: '小屏', icon: 'iconquxiaoquanping', isText: false },
        { id: 5, text: '缩小', icon: 'iconsuoxiao', isText: false },
        { id: 6, text: '下一张', icon: 'iconright', isText: false }
      ]
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.imgVisible
      },
      set(val) {
        this.$emit('update:imgVisible', val)
      }
    },
    width() {
      return this.isFullScreen ? '100%' : '600px'
    }
  },
  created() {
    this.styleObj.minHeight = '500px'
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.init()
  //   })
  // },
  methods: {
    btnClick(id) {
      switch (id) {
        case 1:
          this.$emit('viewEmit')
          break
        case 2:
          this.enlarge()
          break
        case 3:
          this.rotate()
          break
        case 4:
          this.fullScreen()
          break
        case 5:
          this.narrow()
          break
        case 6:
          this.$emit('viewEmit', true)
          break
      }
    },
    init() {
      this.loading = true
      this.imgBigShow(this.viewSrc)
    },
    imgBigShow(src) {
      let canvas = document.getElementById('canvas')
      this.zoom.cxt = canvas.getContext('2d')
      // this.canvas = document.getElementById('canvas')
      // let bbox = canvas.getBoundingClientRect()
      this.zoom.img = new Image()
      this.zoom.img.src = src
      this.zoom.img.id = 'pic'
      this.zoom.imgScale = 1
      let that = this
      this.zoom.img.onload = function () {
        that.zoom.imgW = that.zoom.img.width
        that.zoom.imgH = that.zoom.img.height

        that.fullScreenFn(that)
        that.loading = false
      }
    },
    fullScreen() {
      this.isFullScreen = !this.isFullScreen
      this.$nextTick(() => {
        // 重新设置canvas的高度（高度太大）
        this.fullScreenFn()
      })
    },
    fullScreenFn() {
      let canvas = document.getElementById('canvas')
      let div = document.getElementById('imgBig')
      if (this.isFullScreen) {
        div.style.height = window.innerHeight - 40 + 'px'
        canvas.width = div.offsetWidth
        canvas.height = div.offsetHeight - 80
        this.zoom.cimgW = canvas.width * 0.3
        this.zoom.cimgH = (canvas.width * 0.3 * this.zoom.imgH) / this.zoom.imgW
        this.zoom.imgX = (canvas.width - this.zoom.cimgW) * 0.5
        this.zoom.imgY = (canvas.height - this.zoom.cimgH) * 0.5
      } else {
        // that.zoom.imgX = 0
        div.style.height = 500 + 'px'
        canvas.width = div.offsetWidth * 0.9
        canvas.height = div.offsetHeight - 80
        this.zoom.cimgW = canvas.width
        this.zoom.cimgH = (canvas.width * this.zoom.imgH) / this.zoom.imgW
        this.zoom.imgX = 0
        this.zoom.imgY = 0
      }

      // this.zoom.imgY = 0
      this.zoom.imgScale = 1
      this.zoom.currentRate = 0
      this.zoom.mouseDownLocation = ''
      this.drawImage()
    },
    drawImage() {
      let canvas = document.getElementById('canvas')
      // let bbox = canvas.getBoundingClientRect()
      // this.zoom.cxt.clearRect(-600, -600, canvas.width * 3, canvas.height * 3)
      if ([90, 270].includes(this.zoom.currentRate)) {
        this.zoom.cxt.clearRect(
          (canvas.width - canvas.height) / 2,
          -(canvas.width - canvas.height) / 2,
          canvas.height,
          canvas.width
        )
      } else {
        this.zoom.cxt.clearRect(0, 0, canvas.width, canvas.height)
      }
      this.zoom.cxt.drawImage(
        this.zoom.img,
        this.zoom.imgX,
        this.zoom.imgY,
        this.zoom.cimgW * this.zoom.imgScale,
        this.zoom.cimgH * this.zoom.imgScale
      )
    },
    loadImage() {
      let canvas = document.getElementById('canvas')
      if (this.zoom.img.width <= canvas.width && this.zoom.img.height <= canvas.height) {
        this.zoom.imgX = (canvas.width - this.zoom.img.width * this.zoom.imgScale) / 1.1
        this.zoom.imgY = (canvas.height - this.zoom.img.height * this.zoom.imgScale) / 1.1
      } else {
        let ratio = this.zoom.img.width / this.zoom.img.height
        let widthTime = this.zoom.img.width / canvas.width
        let heightTime = this.zoom.img.height / canvas.height

        if (widthTime > heightTime) {
          this.zoom.img.width = canvas.width
          this.zoom.img.height = canvas.width / ratio
        } else {
          this.zoom.img.height = canvas.height
          this.zoom.img.width = canvas.height * ratio
        }
        this.zoom.imgX = (canvas.width - this.zoom.img.width * this.zoom.imgScale) / 1.1
        this.zoom.imgY = (canvas.height - this.zoom.img.height * this.zoom.imgScale) / 1.1
      }
    },
    // windowToCanvas此方法用于鼠标所在点的坐标切换到画布上的坐标
    windowToCanvas(canvas, x, y) {
      let bbox = canvas.getBoundingClientRect()
      return {
        x: x - bbox.left - (bbox.width - canvas.width) / 1.1,
        y: y - bbox.top - (bbox.height - canvas.height) / 1.1
      }
    },
    isPointInImageArea(point) {
      return true
    },
    isPointInCanvasArea(point) {
      return true
    },
    isDivArea(point) {
      return true
      // let bbox = document.getElementById('imgBig').getBoundingClientRect()
      // return (point.x > bbox.left && point.x < bbox.right && point.y > bbox.top && point.y < bbox.bottom)
    },
    canvasMouseWheel(event) {
      let canvas = document.getElementById('canvas')
      let wheelDelta = event.wheelDelta
      wheelDelta = wheelDelta || event.deltaY * -40

      this.zoom.imgScale = wheelDelta > 0 ? this.zoom.imgScale * 1.1 : this.zoom.imgScale / 1.1
      this.zoom.imgX = (canvas.width - this.zoom.cimgW * this.zoom.imgScale) * 0.5
      this.zoom.imgY = (canvas.height - this.zoom.cimgH * this.zoom.imgScale) * 0.5

      this.drawImage()
      return false
    },
    /** 鼠标按下*/
    canvasMouseDown(event) {
      this.zoom.mouseDownLocation = this.windowToCanvas(canvas, event.clientX, event.clientY)
      if (this.isPointInImageArea(this.zoom.mouseDownLocation)) {
        this.zoom.isMouseDown = true
      }
      canvas.style.cursor = 'move'
    },
    /** 鼠标弹起*/
    canvasMouseUp() {
      this.zoom.isMouseDown = false
      canvas.style.cursor = 'pointer'
    },
    // 鼠标滑上
    canvasMouseOver(event) {
      let canvas = document.getElementById('canvas')
      if (this.zoom.isMouseDown) {
        canvas.style.cursor = 'pointer'
      }
    },
    /** 鼠标移动*/
    canvasMouseMove(event) {
      let canvas = document.getElementById('canvas')
      if (this.zoom.isMouseDown) {
        canvas.style.cursor = 'move'
        let newMouseLocation = this.windowToCanvas(canvas, event.clientX, event.clientY)
        if (
          this.isDivArea({
            x: event.clientX,
            y: event.clientY
          })
        ) {
          let x = newMouseLocation.x - this.zoom.mouseDownLocation.x
          let y = newMouseLocation.y - this.zoom.mouseDownLocation.y
          this.zoom.mouseDownLocation = newMouseLocation
          // console.log(x, y)
          /** 根据角度，计算图片偏移*/
          if (this.zoom.currentRate == 0) {
            this.zoom.imgX += x
            this.zoom.imgY += y
          } else if (this.zoom.currentRate == 90) {
            this.zoom.imgX += y
            this.zoom.imgY -= x
          } else if (this.zoom.currentRate == 180) {
            this.zoom.imgX -= x
            this.zoom.imgY -= y
          } else if (this.zoom.currentRate == 270) {
            this.zoom.imgX -= y
            this.zoom.imgY += x
          }
        } else {
          /** 鼠标移动至画布范围外，置鼠标弹起 */
          this.zoom.isMouseDown = false
          canvas.style.cursor = 'default'
          // document.title = 'mouse up';
        }
        this.drawImage()
      }
    },
    enlarge() {
      let canvas = document.getElementById('canvas')
      this.zoom.imgScale *= 1.1
      this.zoom.imgX = (canvas.width - this.zoom.cimgW * this.zoom.imgScale) / 2
      this.zoom.imgY = 0
      this.drawImage()
      return false
    },
    rotate() {
      let canvas = document.getElementById('canvas')
      let angle = 90
      /** 旋转angle度*/
      this.zoom.currentRate = (this.zoom.currentRate + angle) % 360

      // this.zoom.cxt.clearRect(0, 0, canvas.width, canvas.height)
      this.zoom.cxt.translate(canvas.width / 2, canvas.height / 2)
      this.zoom.cxt.save()
      this.zoom.cxt.rotate((angle * Math.PI) / 180)
      this.zoom.cxt.translate(-canvas.width / 2, -canvas.height / 2)

      this.zoom.imgScale = 1

      this.loadImage()

      this.zoom.imgX = (canvas.width - this.zoom.cimgW) * 0.5
      this.zoom.imgY = (canvas.height - this.zoom.cimgH) * 0.5

      this.drawImage()
      // this.zoom.cxt.restore()
    },
    narrow() {
      let canvas = document.getElementById('canvas')
      this.zoom.imgScale /= 1.1
      this.zoom.imgX = (canvas.width - this.zoom.cimgW * this.zoom.imgScale) / 2
      this.zoom.imgY = 0
      this.drawImage()
      return false
    },
    close() {
      this.dialogVisible = false
      this.isFullScreen = true
      this.zoom.imgX = 0
      this.zoom.imgY = 0
      this.zoom.imgScale = 1
      this.zoom.imgW = 0
      this.zoom.imgH = 0
    }
  }
}
</script>

<style scoped lang="less">
.imgWrapper {
  .imgBig {
    background: #fff;
    text-align: center;
    width: 100%;
    /*height:100%;*/
    position: relative;
    canvas {
      margin-top: 20px;
      z-index: 10;
      display: inline-block;
    }
    .btnOpera {
      width: 100%;
      height: 40px;
      text-align: center;
      position: absolute;
      /*left: 35%;*/
      bottom: 0;
      z-index: 19;
      .inside {
        height: 40px;
        display: inline-flex;
        li {
          font-size: 12px;
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          line-height: 40px;
          text-align: center;
          border-radius: 50%;
          background: @primary-color;
          margin-left: 10px;
          z-index: 20;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      }
    }
    .anticon {
      line-height: 2.2;
      color: #fff;
      font-size: 20px !important;
    }
  }
}
</style>
