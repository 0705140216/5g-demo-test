<template>
  <a-range-picker
    ref="rangePicker"
    v-model="val"
    :placeholder="placeholder"
    v-bind="$attrs"
    v-on="$listeners"
    @change="onChange"
  />
</template>

<script>
import moment from 'moment'
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
  },
  computed: {
    val: {
      get() {
        return Array.isArray(this.value) && this.value.length
          ? [moment(this.value[0], this.format), moment(this.value[1], this.format)]
          : []
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    onChange(date, dateString) {
      this.val = date.length ? dateString : []
    }
  }
}
</script>
