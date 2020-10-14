import auth from './auth'
import drag from './drag'
import watermark from './watermark' // 水印

const install = function (Vue) {
  Vue.directive('auth', auth)
  Vue.directive('drag', drag)
  Vue.directive('watermark', watermark)
}

export default { install }
