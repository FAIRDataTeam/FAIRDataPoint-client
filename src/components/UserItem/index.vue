<template>
  <div
    class="item-list__item"
    :class="{'item-list__item--frameless': frameless}"
    data-cy="user-item"
  >
    <user-avatar :user="user" />
    <div class="item-list__item__content">
      <div class="item-list__item__content__row">
        <slot name="name">
          <strong>{{ user.firstName }} {{ user.lastName }}</strong>
        </slot>
      </div>
      <div class="item-list__item__content__row">
        {{ user.email }}
      </div>
    </div>
    <div class="item-list__item__actions">
      <slot name="actions" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import UserAvatar from '../UserAvatar/index.vue'

@Component({
  components: { UserAvatar },
})
export default class UserItem extends Vue {
  @Prop({ required: true })
  readonly user: any

  @Prop({ type: Boolean, default: false })
  readonly frameless: boolean
}
</script>
