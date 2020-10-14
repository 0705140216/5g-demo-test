<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import version from '@/mixins/version'

export default {
  mixins: [version],
  data() {
    return {
      zh_CN
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
