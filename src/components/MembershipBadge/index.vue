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
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'


@Component
export default class MembershipBadge extends Vue {
  @Prop({ required: true })
  readonly entity: any

  get role() {
    return _.get(this.entity, 'member.membership.name', _.get(this.entity, 'membership.name'))
  }
}
</script>
