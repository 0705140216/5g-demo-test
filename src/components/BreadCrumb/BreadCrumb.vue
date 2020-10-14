<template>
  <div class="current-position">
    当前位置：
    <a-breadcrumb :routes="breadList">
      <template slot="itemRender" slot-scope="{ route, params, routes, paths }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="to(route)">
          {{ route.breadcrumbName }}
        </router-link>
      </template>
    </a-breadcrumb>
    <br />
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    breadList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    to() {
      return route => {
        let newRoute = { ...route }
        delete newRoute.breadcrumbName
        return newRoute
      }
    }
  }
}
</script>

<style scoped lang="less">
.current-position {
  display: flex;
}
</style>
