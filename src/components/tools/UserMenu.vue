<template>
  <div class="user-wrapper">
    <div class="content-box">
      <notice-icon
        class="action"
        :show-dot="showDot"
        :list="msgList"
        :loading="msgLoading"
        @loadData="loadMsgData"
        @read="readMsg"
      />

      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar || avatar2" />
          <span class="name">{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="2">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

      <span v-if="isPhysician" class="action work-change" @click="workChange">
        <a-tooltip
          placement="bottom"
          overlay-class-name="tips"
          :get-popup-container="
            triggerNode => {
              return triggerNode.parentNode
            }
          "
        >
          <template slot="title">
            {{ isWork ? '休息一下' : '开始工作' }}
          </template>
          <svg-icon :type="isWork ? 'iconworking' : 'iconrest'" :style="{ fontSize: '20px', marginTop: '22px' }" />
        </a-tooltip>
      </span>
    </div>
    <terminal v-if="terminalShow" :visible.sync="terminalShow" @onSelect="terminalSelected" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'UserMenu',
  components: {},
  data() {
    this.avatar2 = require('@/assets/icons/avatar-default.svg')
    return {
      terminalShow: false,
      showDot: false,
      msgLoading: true,
      msgList: []
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'roles', 'isWork', 'roleType', 'isAudit', 'userId']),
    ...mapState({
      lastReMsg: state => state.socket.lastReMsg,
      info: state => state.user.info
    }),
    isPhysician() {
      return this.isAudit != 1
    }
  },
  watch: {
    lastReMsg: {
      handler(msg) {
        // 属于推送消息，展示消息提示
        if (isPushMsg(msg.cmd)) {
          this.showDot = true
        }
      }
    }
  },
  created() {
    getSysMessage({
      pageNo: 1,
      pageSize: 10,
      isRead: 0,
      userId: this.userId
    }).then(res => {
      this.showDot = !!res.data.total
    })
  },
  methods: {
    ...mapActions(['Logout', 'ChangeRoles']),
    changeOnline() {
      let isOnline = ''
      if (this.roleType == 1) {
        isOnline = this.isWork ? 1 : 0
      } else {
        isOnline = this.isWork ? 3 : 2
      }
      onLine({ isOnline })
    },
    roleTypeChange(type) {
      this.$store.commit('SET_ROLETYPE', type)
      this.$storage.set('roleType', type)

      this.$store.commit('SET_ISWORK', false)
      this.$storage.set('isWork', false)

      this.$router.push({ name: '/' })
      setTimeout(() => {
        window.location.reload()
      }, 16)
      // this.ChangeRoles()
    },
    terminalSelected({ account }) {
      this.changeOnline()
      this.$storage.set('account', account)
      this.$storage.set('isWork', true)
      this.$store.commit('SET_ISWORK', true)
    },
    workChange() {
      if (this.$storage.get('account')) {
        const status = !this.isWork
        this.changeOnline()
        this.$store.commit('SET_ISWORK', status)
        this.$storage.set('isWork', status)
      } else {
        this.terminalShow = true
      }
    },
    async handleLogout() {
      await this.$confirm('确定要退出登录吗 ?')
      this.Logout({}).then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 16)
      })
    },
    // 获取消息列表
    loadMsgData() {
      this.msgLoading = true
      getSysMessage({
        pageNo: 1,
        pageSize: 10,
        isRead: 0,
        userId: this.userId
      })
        .then(res => {
          this.msgList = res.data.records
          this.msgLoading = false
          this.showDot = !!res.data.total
        })
        .catch(() => {
          this.msgLoading = false
        })
    },
    // 阅读消息
    readMsg({ msgId }) {
      sysMessageAck({ msgId }).then(() => {
        this.loadMsgData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.work-change {
  /deep/.tips {
    .ant-tooltip-arrow::before {
      background-color: #fff;
    }
    .ant-tooltip-inner {
      width: 70px;
      background-color: #fff;
      color: @primary-color;
    }
  }
}
.role-select {
  /deep/.ant-select-selection {
    border-radius: 4px;
  }
}
</style>
