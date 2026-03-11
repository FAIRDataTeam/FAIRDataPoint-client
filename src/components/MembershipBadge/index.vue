<template>
  <span
    v-if="role"
    class="membership-badge"
    data-cy="membership-badge"
  >
    {{ role }}
  </span>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import _ from 'lodash'

export default defineComponent({
  props: {
    entity: { type: Object as PropType<any>, required: true },
  },
  computed: {
    role() {
      return _.get(this.entity, 'member.membership.name', _.get(this.entity, 'membership.name'))
    },
  },
})
</script>
