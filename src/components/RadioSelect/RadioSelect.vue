<template>
  <a-radio-group v-model="val" v-bind="$attrs" v-on="$listeners">
    <a-radio
      v-for="item in data"
      :key="item[valueKey]"
      :value="item[valueKey]"
      :disabled="unableItems.includes(item[valueKey])"
    >
      <slot :prex="item"></slot>
      {{ item[labelKey] }}
    </a-radio>
  </a-radio-group>
</template>

<script>
export default {
  name: 'RadioSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    unableItems: {
      // 禁用选项
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
