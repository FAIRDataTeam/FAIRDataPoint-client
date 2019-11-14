<template>
  <div
    class="item-list__item"
    :class="{'item-list__item--frameless': frameless}"
  >
    <UserAvatar :user="user" />
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
<script>
import UserAvatar from '../UserAvatar'

export default {
  name: 'UserItem',
  components: { UserAvatar },
  props: {
    user: {
      type: Object,
      required: true,
    },
    frameless: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
