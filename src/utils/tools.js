/**
 * 获取当前报告生成时间
 */
export const getNowTime = () => {
  let date = new Date()
  let dateArr = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  }
  for (let k in dateArr) {
    if (dateArr[k] < 10) {
      dateArr[k] = '0' + dateArr[k]
    }
  }
  let fullDate =
    dateArr.year +
    '-' +
    dateArr.month +
    '-' +
    dateArr.day +
    ' ' +
    dateArr.hours +
    ':' +
    dateArr.minutes +
    ':' +
    dateArr.seconds
  return fullDate
}

/**
 * 获取地区的第一个对象ID
 */
export const getFirstItem = data => {
  let arr = []
  let getChild = item => {
    arr.push(item.id)
    item.children && item.children.length && getChild(item.children[0])
  }
  data.length && getChild(data[0])
  return arr
}
