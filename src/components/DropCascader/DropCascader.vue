<template>
  <a-cascader
    v-model="val"
    :options="defOptions"
    :field-names="fieldNames"
    :expand-trigger="expandTrigger"
    :show-search="{ filter }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <a-icon v-if="!defOptions[0]&&showLoading" slot="suffixIcon" type="loading" />
  </a-cascader>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, Number, String]
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    options: {
      // 数据层
      type: Array,
      default: () => {
        return []
      }
    },
    expandTrigger: {
      type: String,
      default: 'hover'
    },
    fieldNames: {
      type: Object,
      default: () => {
        return {
          label: 'areaName',
          value: 'id',
          children: 'children'
        }
      }
    }
  },
  data() {
    return {}
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
    },
    defOptions() {
      if (this.options && this.options.length) {
        return this.options
      } else {
        return this.$store.state.area.allArea
      }
    }
  },
  created() {
    this.$store.dispatch('area/GETALLAREADATA')
  },
  methods: {
    filter(inputValue, path) {
      return path.some(i => i[this.fieldNames.label].includes(inputValue))
    }
  }
}
</script>

<style scoped></style>
