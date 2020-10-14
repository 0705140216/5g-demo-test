import moment from 'moment'

// 设置数字千位符
export function numberFormat(value) {
  let f, r
  if ((!value && value != 0) || Number.isNaN(Number(value))) return ''
  !Number.isInteger(Number(value)) ? ([r, f] = value.toString().split('.')) : (r = value.toString())
  r = r.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  if (f) {
    return r + '.' + f
  }
  return r
}

// 格式化日期
export function dateFormat(dataStr, pattern = 'YYYY-MM-DD') {
  return moment(dataStr).format(pattern)
}

// 小数转化百分数保留两位小数同时加上百分号
export function percentFormat(value) {
  if (typeof (value * 100) == 'number') {
    return (value * 100).toFixed(2) + '%'
  } else {
    return ''
  }
}
export const getSex = key => {
  const sexOptions = {
    '0': '未知',
    '1': '男',
    '2': '女'
  }
  return sexOptions[key]
}

// 审批状态
export const auditStatus = key => {
  const auditStatus = {
    1: '已通过',
    2: '已拒绝',
    3: '待审批',
    4: '已撤销'
  }
  return auditStatus[key]
}

// 请假状态
export const leaveStatus = key => {
  const leaveStatus = {
    0: '正常',
    1: '请假',
    2: '放假',
    3: '实习',
    4: '休学',
    5: '转学',
    6: '出过',
    7: '生病',
    8: '退学',
    9: '毕业',
    10: '人在外地学籍在本地',
    11: '其它'
  }
  return leaveStatus[key]
}
