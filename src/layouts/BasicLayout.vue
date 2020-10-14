<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :theme="theme"
    :layout="layout"
    :content-width="contentWidth"
    :media-query="query"
    :is-mobile="isMobile"
    :handle-media-query="handleMediaQuery"
    :handle-collapse="handleCollapse"
  >
    <template v-slot:menuHeaderRender>
      <div>
        <svg-icon type="iconyinbingqueke" />
        <h1>{{ config.title }}</h1>
      </div>
    </template>

    <template v-slot:rightContentRender>
      <right-content :top-menu="false" :theme="theme" />
    </template>

    <router-view />

    <template v-slot:footerRender>
      <global-footer v-if="!isQiankun" />
      <div v-else style="display: none;"></div>
    </template>
  </pro-layout>
</template>

<script>
import ProLayout from '@ant-design-vue/pro-layout'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import { mapState } from 'vuex'
import { convertRoutes } from '@/utils/routeConvert'
import config from '@/config/settings'

export default {
  name: 'BasicLayout',
  components: {
    ProLayout,
    RightContent,
    GlobalFooter
  },
  data() {
    this.config = config
    return {
      collapsed: false,
      query: {},
      layout: 'sidemenu',
      contentWidth: 'Fluid',
      theme: 'light',
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      mainMenu: state => state.permission?.addRouters ?? []
    }),
    menus() {
      const routes = convertRoutes(this.mainMenu.find(item => item.path === '/'))
      return routes?.children ?? []
    },
    isQiankun() {
      return window.__POWERED_BY_QIANKUN__
    }
  },
  created() {},
  methods: {
    handleMediaQuery(query) {
      this.query = query
      if (this.isMobile && !query['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && query['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
      }
    },
    handleCollapse(collapsed) {
      this.collapsed = collapsed
    }
  }
}
</script>

<style lang="less"></style>
