# 5g-cloud-diagnosis

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

## 架构梳理

- 文件目录
- 权限及路由
- `Vuex` 状态管理
- 页面布局组件的使用
- 一个基础列表的代码演示
- 一个基础表单的代码演示
- `mock` 和 `esay mock` 的使用
- 全局组件的注册
- 第三方插件的引入
- 系统主题、布局样式 默认配置及响应式说明
- 样式定义的规范
- `api` 定义的规范
- `icon` 的使用
- 代码格式规范 `eslint` 和 `prettiter` 配置

## 风格

- 组件命名（文件夹命名跟随组件命名风格）

  - `src/components` 全局组件以单词大写开头 (PascalCase)，以同名文件夹包裹
  - `src/views` 页面及局部组件均以横线连接 (kebab-case)

- 路由 `src/router`

  - **modules** 名称以单词小写开头 (pascalCase)
  - **component** 名称以单词大写开头 (PascalCase)
  - **path** 以横线连接 (kebab-case)
  - **query** 以下划线连接（task_id）

- store `src/store`

  - **modules** 名称以单词小写开头 (pascalCase)
  - **getters** 高频使用的数据
  - **mutations** 名称以单词全大写以`_`连接(PASCAL_CASE)
  - **actions** 名称以单词大写开头 (PascalCase)

- api 示例

```js
import axios from '@/utils/request'

// 本地调试api前缀
const LOCAL = ''

const api = {
  user: `${LOCAL}/user` // 获取用户信息
  menuList: `${LOCAL}/menuList`, // 获取用户菜单列表
  updateInfo: `${LOCAL}/updateInfo` // 更新用户信息
}

export function getUser(params) {
  return axios({
    url: api.user,
    method: 'get',
    params
  })
}

export function updateInfo(data) {
  return axios({
    url: api.updateInfo,
    method: 'post',
    data
  })
}
```

- 全局样式 `src/assets/styles/`

  - **antd-reset** antd 重置样式
  - **global** 基础样式
  - **public** 公用样式
  - **transition** 过渡动画
  - **utils** 样式 mixins
  - **variables** 变量

- 第三方依赖 `src/core`

  - **directives** 全局指令
  - **antd** 按需引入 antd
  - **bootstrap** 项目初始化入口
  - **icons** 图标管理入口
  - **library** 第三方依赖注册
  - **staticConstants** 定义全局静态常量（非接口数据）

- 工具集 `src/utils`
  - **filter** 过滤器，并在`library`中引入注册为全局过滤器
  - **formRules** 表单验证可复用规则
  - **request** axios 数据服务层
  - **util** 工具方法

## 代码格式

项目基于`eslint`和`prettier`实现自动化格式校验

实现保存自动修复，`Vscode` 须做以下工作：

1. 安装插件 `ESlint` 和 `Prettier`
2. 在 setting.json 中加入配置

```bash
  "files.autoSave": "afterDelay",
  "search.followSymlinks": false,
  "git.autorefresh": false,
  "git.enableSmartCommit": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
```

> 禁用 `git` 自动刷新可减轻运行负担，内存占用高 程序卡顿等问题

## 异步编程方案

- 有接口联动的情况 `async / await`, 配合 `try catch` 捕获异常
- 单一接口使用`Promise.then()`
- 多个接口`Promise.all()`

> `try catch` 无须对异常做处理的情况可省略异常参数，配合 bable 插件 `@babel/plugin-proposal-optional-catch-binding`

```js
try {
  // ...
} catch {
  // ...
}
```

## 事件分发

页面中事件分发逻辑优化方案：

1. 判断情形超过 3 种 使用 switch 流程控制
2. 针对情形逻辑复杂（接口调用，if 逻辑判断）独立封装方法 调用

```js
  handleClick({ act, taskId，orgName } = {}) {
    switch (act) {
      case 0: {
        // 查看任务详情
        this.taskViewModalShow = true
        this.taskViewModal.record = Object.assign({}, record, {})
        break
      }
      case 2: {
        // 新增
        this.taskViewModalShow = true
        this.taskViewModal.record = Object.assign({}, record, {})
        break
      }
      case 3: // 删除
        this.deleteTask(taskId, orgName)
        break
      case 4: // 创建复查任务
        this.createRecheckTask(taskId, orgName)
        break
    }
  },
```

## 代码语法

**可选链（Optional Chaining）**，添加 Babel 插件 `@babel/plugin-proposal-optional-chaining` 可支持

```js
const currentJob = person?.jobs.getCurrentJob?.() ?? 'none'
```

上面的例子中，如果没有 getCurrentJob 方法，那么 currentJob 将会返回 none。

> 注：在访问确定的数据时，无须使用此语法。 与 || 语法区别在于对数字 0 的处理，前者会保留 0，后缀或隐式转换为 false

一个基本接口请求示例：

```js
import getDetails from '@/api/user'

methods:{
  getDetails(){
    const {id} = this.user

    this.loading = true
    getDetails(id)
      .then(({data}) => {
        this.details = data || {}
      })
      .finally(() => {
        this.loading = false
      })
  }
}
```

一个联动依赖的请求示例：

```js
methods:{
   async getSelectList() {
      await this.getSchoolList() // 管理员获取学校列表
      await this.getPlainList() // 任务

      if (this.planList.length) {
        await this.getPrefxList() // 学段
        await this.getClassYearList() // 非总管理员获取学年列表
        await this.getClassList() // 班主任获取班级列表

        this.getData()
      }
    }
}
```

一个常见列表页的数据请求策略：

- `getSelectList` 方法获取所有需要远程获取筛选条件
- `getData` 获取数据

```js
methods:{
    getSelectList() {
      this.getSchoolList() // 管理员获取学校列表
      this.getPlainList() // 任务
    },
    getData() {
      this.getScreenData() // 筛查数据
      this.getTask() // 任务详情
      this.screeningRate() // 筛查率
    }
}
```

批量给对象属性赋值：

```js
this.receiveOpts = Object.assign({}, this.receiveOpts, {
  visible: true,
  title: v == 1 ? '待接收学生名单' : '拒收学生名单',
  row: { type: v, orgId: this.orgInfo.orgId }
})
```

针对非动态数据的处理：

```js
  const columns = []
  data() {
    this.columns = columns
    return {
       options: Object.freeze({})
    }
  },
```

`debounce()` 使用场景：

1. 表单提交
2. 数据查询/刷新
3. 窗口 `resize`
4. 远程搜索框

```js
import { debounce } from '@/utils/util'

 created() {
    this.setTableMaxHeight = debounce(this.setTableMaxHeight, 200, false)
    this.handleSearch = debounce(this.handleSearch)
  },
```

form 表单相关：

1. `v-model` 使用 配合修饰符
2. 弹框使用 自定义组件引入`mixins/modal` 数据由父组件传入
3. 弹框校验方法名称统一使用 `validate`

```html
<a-form-model-item label="任务名称" prop="taskName">
  <a-input v-model.trim="form.taskName" />
</a-form-model-item>
```

一个简单的弹框设计模型：

```js
import modal from '@/mixins/modal'
import formRules from '@/utils/formRules'

export default {
  name: 'TaskFormModal',
  mixins: [modal],
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    handleOk() {
      this.validate()
    },
    validate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {}
          this.submit(params)
        }
      })
    },
    async submit(formData) {}
  }
}
```

其它规定：

1. 一个远程模糊搜索的接口一次返回数据不超过 20 条
2. 准确把握计算属性及属性监听的使用场景
3. 业务代码尽量提供详细的备注
4. 尽可能的使用解构语法来简化代码
5. 模版内避免使用多条件并行判断（可考虑使用计算属性）
6. 有待补充

## 图标的使用

图标采用 svg 格式

```js
export { default as diagnosis } from '@/assets/icons/diag.svg?inline' // path to your '*.svg?inline' file.
export { default as patientManage } from '@/assets/icons/manage.svg?inline'
export { default as reserve } from '@/assets/icons/reserve.svg?inline'

import { Icon } from 'ant-design-vue'

export const SvgIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1861810_q91gabxx37.js',
  extraCommonProps: {
    style: {
      fontSize: 'inherit'
    }
  }
})
```

## 权限变更

- 重新获取用户权限
- 根据用户信息生成路由
- 动态挂载路由
