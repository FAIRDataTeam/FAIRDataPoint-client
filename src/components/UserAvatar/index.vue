<template>
  <avatar
    :initials="initials"
    :value="user.email"
    :smaller="smaller"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Avatar from '../Avatar/index.vue'

export default defineComponent({
  components: { Avatar },
  props: {
    user: { type: Object, required: true },
    smaller: { type: Boolean, default: false },
  },
  computed: {
    initials(): string {
      return this.user.firstName[0] + this.user.lastName[0]
    },
  },
})
</script>
