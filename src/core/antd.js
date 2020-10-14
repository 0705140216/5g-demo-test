/* eslint-disable */
/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 *
 * 注意：需要同时修改 babel.config.js 文件下的配置项
 */
import Vue from 'vue'
import {
  ConfigProvider,
  Layout,
  PageHeader,
  Input,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Select,
  Card,
  Form,
  FormModel,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Icon,
  Badge,
  Popover,
  Dropdown,
  List,
  Avatar,
  Breadcrumb,
  Steps,
  Spin,
  Menu,
  Drawer,
  Tooltip,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Upload,
  Progress,
  Skeleton,
  Popconfirm,
  message,
  notification,
  collapse,
  rate,
  Cascader,
  Affix,
  AutoComplete,
  pagination,
  Empty,
  Timeline,
  statistic,
  result,
  TreeSelect,
  Tree
} from 'ant-design-vue'

Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(PageHeader)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Breadcrumb)
Vue.use(Steps)
Vue.use(Spin)
Vue.use(Menu)
Vue.use(Drawer)
Vue.use(Tooltip)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Skeleton)
Vue.use(Popconfirm)
Vue.use(notification)
Vue.use(collapse)
Vue.use(rate)
Vue.use(Cascader)
Vue.use(Affix)
Vue.use(AutoComplete)
Vue.use(pagination)
Vue.use(Empty)
Vue.use(Timeline)
Vue.use(statistic)
Vue.use(result)
Vue.use(TreeSelect)
Vue.use(Tree)

// Add to this.$xxx
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning

Vue.prototype.$confirm = (content = '是否继续？', title = '确认提示', extra = {}) => {
  const options = {
    title: title,
    content: content,
    okText: '确定',
    okType: 'primary',
    cancelText: '取消',

    ...extra
  }

  return new Promise((resolve, reject) => {
    Modal.confirm({
      onOk() {
        resolve()
      },
      onCancel() {
        reject()
      },
      ...options
    })
  })
}
