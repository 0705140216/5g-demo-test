<template>
  <a-select v-model="val" :placeholder="placeholder" v-bind="$attrs" v-on="$listeners">
    <a-icon v-if="!data[0] && showLoading" slot="suffixIcon" type="loading" />
    <a-select-option v-for="item in data" :key="item[valueKey]" :disabled="unableItems.includes(item[valueKey])">
      {{ item[labelKey] }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'DropSelector',
  props: {
    value: {
      type: [String, Number, Array],
      default: undefined
    },
    showLoading: {
      type: Boolean,
      default: false
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
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('changeInfo', val)
      }
    }
  }
}
</script>
