<template>
  <a-card :bordered="false">
    <a-page-header title="测试页" />

    <a-card title="事件">
      <a-button @click="curtabRename">重命名当前tab</a-button>
      <a-button @click="tabOpen">打开一个Tab</a-button>
      <a-button @click="curtabClose">关闭当前tab</a-button>

      <a-button @click="storage(1)">设置storage</a-button>
      <a-button @click="storage(2)">获取storage</a-button>
      <a-button @click="storage(3)">移出storage</a-button>
    </a-card>

    <a-card title="消息测试区">
      <a-button @click="websoketOpen">连接websoket</a-button>
      <a-button @click="websoketClose">断开websoket</a-button>
      <a-button @click="websoketSend(0)">发送普通文本消息</a-button>
      <a-button @click="websoketSend(1)">发送图片消息</a-button>
      <a-button style="margin-left: 20px;" @click="chatVisible = true">点击唤起聊天弹窗</a-button>
    </a-card>

    <a-card title="乾坤测试">
      <div class="home">第一个应用 列表</div>
      <a-button type="primary" @click="goMainAppPage">跳转主应用页面</a-button>
      <div style="height: 20px;"></div>
      <a-button type="primary" @click="notice">通信测试</a-button>
    </a-card>
  </a-card>
</template>

<script>
import { createSocket } from '@/core/socket'
import storage from '@/core/store'
import { routerGo } from '@/utils/util'
import { setState } from '@/utils/app-store'

export default {
  name: 'TestView',
  components: {},
  data() {
    return {
      chatVisible: false
    }
  },
  computed: {
    fromUserId() {
      return this.$store.getters.userId
    }
  },
  methods: {
    storage(val) {
      if (val == 1) {
        storage.set('aaaaa', 1111, new Date().getTime() + 3000)
      } else if (val == 2) {
        console.log(storage.get('aaaaa'))
      } else if (val == 3) {
        storage.remove('aaaaa')
      }
    },
    curtabRename() {
      this.$multiTab.rename(this.$route.fullPath, 'hello')
    },
    tabOpen() {
      this.$multiTab.open('/diagnosis/edit-diag')
    },
    curtabClose() {
      // 当前只有一个tab页面时 无法关闭
      this.$multiTab.closeCurrentPage()
      // this.$multiTab.close(this.$route)
    },
    websoketOpen() {
      createSocket(this.$store.getters.userId)
    },
    websoketClose() {
      this.$socket.close()
    },
    goMainAppPage() {
      routerGo('/home')
    },
    notice() {
      setState({ msg: 'hello' })
    }
  }
}
</script>

<style scoped></style>
