export const yn = [
  { label: '是', value: '1' },
  { label: '否', value: '0' }
]

// 筛查下拉项
export const screeningType = [
  { id: 0, name: '不查' },
  { id: 1, name: '必查' },
  { id: 2, name: '选查' }
]

// 学段
export const schoolType = [
  { value: 1, label: '幼儿园' },
  { value: 2, label: '小学' },
  { value: 3, label: '初中' },
  { value: 4, label: '普高' },
  { value: 5, label: '职高' },
  { value: 6, label: '大学专科' },
  { value: 7, label: '大学本科' }
]

// 机构类型
export const orgType = [
  { id: 1, name: '省级地区' },
  { id: 2, name: '市级地区' },
  { id: 3, name: '区/县级地区' },
  { id: 4, name: '学校' }
]

// 查看接受学生
export const ReceivingStudents = [
  {
    title: '学校',
    dataIndex: 'schoolName'
  },
  {
    title: '姓名',
    dataIndex: 'studentName'
  },
  {
    title: '性别',
    dataIndex: 'sex'
  },
  {
    title: '出生日期',
    dataIndex: 'birth'
  },
  {
    title: '提前批学段',
    dataIndex: 'prefxName'
  },
  {
    title: '筛查计划',
    dataIndex: 'planName'
  },
  {
    title: '推送原因',
    dataIndex: 'denialReason'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export const RejectionStudents = [
  {
    title: '学校',
    dataIndex: 'schoolName'
  },
  {
    title: '姓名',
    dataIndex: 'studentName'
  },
  {
    title: '性别',
    dataIndex: 'sex'
  },
  {
    title: '出生日期',
    dataIndex: 'birth'
  },
  {
    title: '提前批学段',
    dataIndex: 'prefxName'
  },
  {
    title: '筛查计划',
    dataIndex: 'planName'
  },
  {
    title: '拒收原因',
    dataIndex: 'pushReason'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

// 学生上传文件类型
export const expStuType = {
  1: '内地（有身份证号）',
  2: '非内地',
  3: '内地（无身份证号）'
}

// 对外公开客服电话
export const telephone = '400-1877-888'

// 全局图表一致性色彩表现
export const colors = [
  '#1890FF',
  '#41D9C7',
  '#2FC25B',
  '#FACC14',
  '#E6965C',
  '#223273',
  '#7564CC',
  '#8543E0',
  '#5C8EE6',
  '#13C2C2',
  '#5CA3E6',
  '#3436C7',
  '#B381E6',
  '#F04864',
  '#D598D9'
]
