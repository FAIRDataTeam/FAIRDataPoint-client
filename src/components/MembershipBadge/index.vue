<template>
  <span
    v-if="role"
    class="membership-badge"
  >
    {{ role }}
  </span>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'MembershipBadge',
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  computed: {
    role() {
      return _.get(this.entity, 'membership.name')
    },
  },
}
</script>
