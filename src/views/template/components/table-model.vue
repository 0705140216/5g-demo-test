<template>
  <a-modal v-bind="options" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="姓名" prop="name">
          <a-input v-if="!isView" v-model.trim="form.name" allow-clear placeholder="请输入姓名" />
          <span v-else>{{ form.name }}</span>
        </a-form-model-item>

        <a-form-model-item label="选择地区" prop="areaId">
          <drop-cascader v-if="!isView" v-model="form.areaId" placeholder="请选择地区"></drop-cascader>
          <span v-else>{{ form.areaName }}</span>
        </a-form-model-item>

        <a-form-model-item label="民族" prop="mintory">
          <drop-selector
            v-if="!isView"
            v-model="form.mintory"
            allow-clear
            :data="mintoryList"
            placeholder="请选择民族"
          ></drop-selector>
          <span v-else>{{ form.mintoryName }}</span>
        </a-form-model-item>

        <a-form-model-item label="性别" prop="sex">
          <radio-select
            v-if="!isView"
            v-model="form.sex"
            label-key="name"
            value-key="id"
            allow-clear
            :data="sexList"
          ></radio-select>
          <span v-else>{{ form.sexName }}</span>
        </a-form-model-item>

        <a-form-model-item label="多选" prop="multip">
          <checkbox-select
            v-if="!isView"
            v-model="form.multip"
            :data="sexList"
            label-key="name"
            value-key="id"
          ></checkbox-select>
          <span v-else>{{ form.payTypeName }}</span>
        </a-form-model-item>

        <a-form-model-item label="描述" prop="desc">
          <a-textarea
            v-if="!isView"
            v-model.trim="form.desc"
            placeholder="请填写描述"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            allow-clear
          />
          <span v-else>{{ form.descName }}</span>
        </a-form-model-item>

        <!--        远程搜索-->
        <a-form-model-item label="所属医院" prop="hos">
          <!--          <remote-select-->
          <!--            v-if="!isView"-->
          <!--            v-model="form.hos"-->
          <!--            :list-api="() => {}"-->
          <!--            placeholder="请输入医院名称"-->
          <!--            :query="{}"-->
          <!--          ></remote-select>-->
          <!--          <span v-else>{{ form.descHos }}</span>-->
        </a-form-model-item>

        <a-form-model-item label="权限" prop="auth">
          <tree-select
            v-if="!isView"
            v-model="form.auth"
            :data="treeData"
            multiple
            tree-checkable
            placeholder="请选择权限"
          ></tree-select>
          <span v-else>{{ form.auth }}</span>
        </a-form-model-item>

        <a-form-model-item label="多选搜索" prop="multSearch">
          <tree-checkbox
            v-if="!isView"
            v-model="form.multSearch"
            :data="treeCheckbox"
            need-search
            placeholder="请选择多选搜索"
            @get-object="getHalfData"
          ></tree-checkbox>
          <span v-else>{{ form.auth }}</span>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <template slot="footer">
      <a-button v-if="isEdit" @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="confirmLoading" :disabled="loading" @click="handleOk">
        {{ isEdit ? '提交' : '确定' }}
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { debounce } from '@/utils/util'
import { rqb, rqc } from '@/utils/formRules'
import newModel from '@/mixins/newModel'

const rules = {
  // 当rules中无调用自定义接口时放外面
  name: [{ ...rqb, message: '请输入姓名' }],
  areaId: [{ ...rqc, message: '请选择地区' }],
  mintory: [{ ...rqc, message: '请选择民族' }],
  sex: [{ ...rqc, message: '请选择性别' }],
  hos: [{ ...rqc, message: '请选择所属医院' }]
}

const treeData = [
  {
    title: '你',
    id: 0,
    children: [
      {
        title: '我',
        id: 1,
        children: [
          {
            title: '大呆',
            id: 2
          },
          {
            title: '牛逼',
            id: 6
          }
        ]
      },
      {
        title: '是',
        id: 3
      }
    ]
  },
  {
    title: '大',
    id: 4,
    children: [
      {
        title: '小呆',
        id: 5
      }
    ]
  }
]
const treeCheckbox = [
  {
    title: '多拉斯柯达1',
    id: 1,
    children: [
      {
        title: '大看电视2',
        id: 2,
        scopedSlots: {
          // custom title
          title: '大看电视2'
        },
        children: [
          {
            title: '巨大3',
            id: 3
          },
          { title: '的三大国发4', id: 4 },
          { title: '飞洒发发5', id: 5 }
        ]
      },
      {
        title: '大的萨达6',
        id: 6,
        children: [
          { title: '大大大7', id: 7 },
          { title: '发顺丰的8', id: 8 },
          { title: '结核杆菌9', id: 9 }
        ]
      },
      {
        title: '阿达萨达10',
        id: 10
      }
    ]
  },
  {
    title: '大萨达11',
    id: 11
  }
]

export default {
  name: 'TableModel',
  mixins: [newModel],
  data() {
    this.rules = rules
    this.treeData = treeData
    this.treeCheckbox = treeCheckbox
    return {
      mintoryList: [{ id: 1, name: '汉族' }],
      sexList: [
        { id: 1, name: '男' },
        { id: 0, name: '女' }
      ],
      form: {}
    }
  },
  computed: {
    isEdit() {
      return this.status === 1
    },
    isView() {
      return this.status === 0
    },
    isAdd() {
      return this.status === 2
    }
  },
  created() {
    this.validate = debounce(this.validate)
    !this.isAdd && this.getDetails()
    !this.isView && this.getSelectList()
  },
  methods: {
    // 获取详情
    getDetails() {
      // let { id } = this.record
      // this.loading = true
      // viewManagerInfo(id).then(({ data }) => {
      //   // https://cn.vuejs.org/v2/api/#Vue-observable
      //   this.form = data
      //   this.isEdit && this.$observable(this.form)
      // }).finally(() => {
      //   this.loading = false
      // })
    },
    getSelectList() {
      // 获取下拉框数据
      // viewManagerInfo(id).then(({data})=>{
      //   this.sexList=data
      // })
    },
    handleOk() {
      !this.isView ? this.validate() : this.handleCancel()
    },
    validate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // const { name } = this.form
          // const params = { name }
          // this.isEdit && (params.id = id)
          this.submit(params)
        }
      })
    },
    async submit(params) {
      this.confirmLoading = true
      // 当有两个接口时
      try {
        // this.isEdit ? await this.apiEdit(params) : await this.apiAdd(params)
        this.confirmLoading = false
        this.$message.success('操作成功')
        this.$emit('on-submit-success')
        this.handleCancel()
      } catch {
        this.confirmLoading = false // 有报错逻辑在这里处理
      } finally {
        this.confirmLoading = false // 统一关掉loading
      }
      // ----------------当只有一个接口时 async不加-------------------
      // insertOrUpdateDoctor(params)
      //   .then(() => {
      //     this.$message.success('操作成功')
      //     this.$emit('on-submit-success')
      //     this.handleCancel()
      //   })
      //   .finally(() => {
      //     this.confirmLoading = false
      //   })
    },
    getHalfData({ halfCheckedKeys, checkedKeys }) {
      console.log('父级获取子集半选以及全选数据', halfCheckedKeys, checkedKeys)
    }
  }
}
</script>
