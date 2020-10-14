<template>
  <a-card :bordered="false">
    <h3>使用antd内置图标</h3>
    <div class="icons-list">
      <a-icon type="smile" theme="twoTone" />
      <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" />
      <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
    </div>

    <h3>使用iconfont图标</h3>
    <div class="icons-list">
      <svg-icon type="icontongzhi" />
      <svg-icon type="iconwangluoguzhang" :style="{ color: 'green' }" />
      <svg-icon type="iconrest" />
    </div>

    <h3>自定义svg</h3>
    <div>
      <!-- <LogoSvg width="200" height="200" /> -->
      <a-icon :component="Doctor" theme="filled" :style="{ fontSize: '80px' }" />
    </div>

    <h3>img链接</h3>
    <img src="~@/assets/icons/logo.svg" height="100" class="logo" alt="logo" />

    <h3>background链接</h3>
    <div class="bk-svg">有背景</div>
  </a-card>
</template>

<script>
import Doctor from '@/assets/icons/logo.svg?inline'
export default {
  name: 'IconSelect',
  components: {},
  data() {
    return {
      Doctor
    }
  }
}
</script>

<style scoped>
.icons-list {
  margin-bottom: 20px;
}
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 24px;
}

.bk-svg {
  width: 200px;
  height: 200px;
  background: #f0f2f5 url(~@/assets/icons/logo.svg) no-repeat 50%;
}
</style>
