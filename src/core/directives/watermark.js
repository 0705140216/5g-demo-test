import store from '@/store'
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    let modeText = new Date().toLocaleDateString() + ' ' + store.state.user.orgInfo.orgName
    let text = (value && value.text) || modeText
    let font = (value && value.font) || '16px Microsoft JhengHei'
    let textColor = (value && value.textColor) || 'rgba(180, 180, 180, 0.2)'
    function addWaterMarker(modeText, parentNode, font, textColor) {
      // 水印文字，父元素，字体，文字颜色
      var can = document.createElement('canvas')
      parentNode.appendChild(can)
      can.width = 300
      can.height = 200
      can.className = 'watermark'
      can.style.display = 'none'

      var cans = can.getContext('2d')
      cans.rotate((-20 * Math.PI) / 180)
      cans.font = font
      cans.fillStyle = textColor
      cans.textAlign = 'left'
      cans.textBaseline = 'Middle'
      cans.fillText(modeText, can.width / 8, can.height / 2)
      parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
    }
    addWaterMarker(text, el, font, textColor)
  }
}
