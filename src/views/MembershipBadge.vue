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
<style scoped lang="scss">
@import "../scss/mixins";
@import "../scss/typography";
@import "../scss/variables";

.membership-badge {
  @include typography-light-14;
  @include border-radius($border-radius-full);
  border: 1px solid $color-text-light;
  display: inline-block;
  padding: $space-xs $space-sm;
}
</style>
