<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <div class="links">
        <!-- <a href="#" target="_blank">首页</a> -->
      </div>
    </template>
    <template v-slot:copyright>
      Copyright
      <a-icon type="copyright" />
      2020
      <span>清大视光科技有限公司</span>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
