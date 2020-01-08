<template>
  <avatar
    :initials="initials"
    :value="user.email"
    :smaller="smaller"
  />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Avatar from '../Avatar/index.vue'

@Component({
  components: { Avatar },
})
export default class UserAvatar extends Vue {
  @Prop({ required: true })
  readonly user: any

  @Prop({ type: Boolean, default: false })
  readonly smaller: boolean

  get initials(): string {
    return this.user.firstName[0] + this.user.lastName[0]
  }
}
</script>
