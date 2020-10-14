<template>
  <div>
    <school-home v-if="orgType === 10" />
    <org-home v-else-if="orgType === 30" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SchoolHome from './components/school-home'
import OrgHome from './components/org-home'

export default {
  components: {
    SchoolHome,
    OrgHome
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      orgType: state => state.user.orgInfo.orgType
    })
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
