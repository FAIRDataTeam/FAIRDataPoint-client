<template>
  <Avatar
    :initials="initials"
    :value="user.email"
    :smaller="smaller"
  />
</template>
<script>
import Avatar from './Avatar.vue'

export default {
  name: 'UserAvatar',
  components: { Avatar },
  props: {
    user: {
      type: Object,
      required: true,
    },
    smaller: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    initials() {
      return this.user.firstName[0] + this.user.lastName[0]
    },
  },
}
</script>
