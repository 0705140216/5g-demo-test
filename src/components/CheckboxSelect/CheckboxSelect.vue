<template>
  <a-checkbox-group v-model="val" v-bind="$attrs" v-on="$listeners">
    <a-checkbox
      v-for="(item, index) in data"
      :key="`${item[valueKey]}-${index}`"
      :value="item[valueKey]"
      :disabled="unableItems.includes(item[valueKey])"
    >
      {{ item[labelKey] }}
    </a-checkbox>
  </a-checkbox-group>
</template>

<script>
export default {
  name: 'CheckboxSelector',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
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
