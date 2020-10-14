<template>
  <a-popover v-bind="$attrs">
    <template slot="content">
      <slot name="content"></slot>
    </template>
    <slot name="touchCon"></slot>
  </a-popover>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, String]
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    placeholder: {
      type: Array,
      default: () => ['开始日期', '结束日期']
    }
  }
}
</script>
