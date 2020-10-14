// lodash api
import deboun from 'lodash/debounce'
export { default as cloneDeep } from 'lodash/cloneDeep'
export { default as isNumber } from 'lodash/isNumber'
export { default as isEqual } from 'lodash/isEqual'
export { default as forIn } from 'lodash/forIn'
export { default as pick } from 'lodash/pick'
export { default as pickBy } from 'lodash/pickBy'
export { default as get } from 'lodash/get'
export { default as find } from 'lodash/find'
export { default as uniq } from 'lodash/uniq'
export { default as sortBy } from 'lodash/sortBy'
export { default as sumBy } from 'lodash/sumBy'
export { default as random } from 'lodash/random'

import once from 'lodash/once'

// 节流
export function debounce(f, t = 500, immediate = true) {
  if (typeof f !== 'function') return
  return deboun(f, t, { leading: immediate, trailing: !immediate })
}

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export const isIE = once(() => {
  const bw = window.navigator.userAgent
  const compare = s => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
})

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 跨应用路由跳转
 * @param {String} href url地址
 * @param {Object} stateObj 状态参数 可以通过history.state读取
 * @param {String} title 标题 暂时没有用
 */
export function routerGo(href = '/', title = null, stateObj = {}) {
  window.history.pushState(stateObj, title, href + '/')
}

/**
 * 下载
 * @param {blob} data
 * @param {Sting} fileName
 */
export const download = (data, fileName) => {
  if (!data) return

  let url = window.URL.createObjectURL(new Blob([data]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

/**
 * @description 全屏打开窗口
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */
export const openWindow = (url, title, w = 0, h = 0) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  w = +w === 0 ? width : w
  h = +h === 0 ? height : h

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  )

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

/**
 * 获取query数据
 */
export const getQueryString = name => {
  var result = window.location.href.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'))
  if (result == null || result.length < 1) {
    return ''
  }
  return result[1]
}
