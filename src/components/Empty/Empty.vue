<template>
  <a-empty>
    <template slot="image">
      <img src="~@/assets/icons/empty.svg" width="64" />
    </template>

    <template slot="description">
      <span :style="descStyle">{{ description }}</span>
    </template>

    <div class="empty-action">
      <slot />
    </div>
  </a-empty>
</template>

<script>
export default {
  name: 'EmptyDefault',
  props: {
    description: {
      type: String,
      default: '暂无数据'
    },
    descStyle: {
      type: Object,
      default: () => ({
        fontSize: '16px',
        color: 'rgba(0, 0, 0, 0.25)'
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-empty-image {
  height: auto;
}
.empty-action {
  text-align: center;
}
</style>
