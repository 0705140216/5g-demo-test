const rqb = { required: true, trigger: 'blur' }
const rqc = { required: true, trigger: 'change' }
const rqbc = { required: true, trigger: ['blur', 'change'] }

// 密码
const pw = { pattern: /^[a-zA-Z0-9._]+$/, message: '仅限输入字母、数字、下划线、.', trigger: ['blur', 'change'] }

// 用户名
const username = {
  pattern: /^(?=.*[a-zA-Z])[a-zA-Z\d]+$/,
  message: '仅限输入字母、数字且必须包含字母',
  trigger: ['blur', 'change']
}

// 账户名
const account = [
  { ...rqb, message: '请输入用户名' },
  { min: 6, max: 16, message: '长度为6 - 16个字符', trigger: 'blur' },
  username
]

// 姓名校验
const consignee = [
  { ...rqb, message: '请输入姓名' },
  { min: 2, max: 15, message: '长度为2 - 15个字符', trigger: 'blur' },
  {
    pattern: /^[a-zA-Z|\u4E00-\u9FA5| \u3400-\u4DB5]+$/,
    message: '请输入2-15个中文或英文字符',
    trigger: ['blur', 'change']
  }
]

// 登录及注册密码
const password = [
  { ...rqb, message: '请输入密码' },
  { min: 8, max: 20, message: '长度为8 - 20个字符', trigger: 'blur' },
  pw
]

// 中文字符
const chineseCharacter = { pattern: /^[\u4E00-\u9FA5]+$/, message: '请输入中文字符', trigger: ['blur', 'change'] }

// 数字
const number = { pattern: /^[0-9]+$/, message: '请输入数字', trigger: ['blur', 'change'] }

// 手机号和座机号
function isTel(v) {
  let isPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ // 手机正则
  let isMob = /^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/ // 座机
  return isPhone.test(v) || isMob.test(v)
}

export { rqb, rqc, rqbc, username, consignee, password, chineseCharacter, number, isTel, pw, account }
