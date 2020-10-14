<template>
  <a-tooltip>
    <template slot="title">
      <span>{{ title }}</span>
    </template>
    <slot>
      <!-- <a-icon :type="type" /> -->
      <a-icon v-if="component" :component="component" />
      <a-icon v-else :type="type" />
    </slot>
  </a-tooltip>
</template>
<script>
export default {
  name: 'Help',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'question-circle'
    },
    component: {
      type: Object,
      default: () => {}
    }
  },
  computed: {}
}
</script>
