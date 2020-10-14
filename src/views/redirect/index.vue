<template>
  <div></div>
</template>

<script>
import { routerGo } from '@/utils/util'

export default {
  created() {
    setTimeout(() => {
      routerGo('/404')
    }, 2000)
  }
}
</script>
