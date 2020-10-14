<template>
  <div class="logo">
    <router-link :to="{ path: '/' }">
      <img src="~@/assets/icons/logo.svg" alt="logo" />
      <!-- <a-icon :component="LogoSvg" theme="twoTone" /> -->
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
// import LogoSvg from '@/assets/icons/logo.svg?inline'
import config from '@/config/settings'

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: config.title,
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data() {
    // this.LogoSvg = LogoSvg
    return {}
  }
}
</script>
