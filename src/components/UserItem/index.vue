<template>
  <div
    class="item-list__item"
    :class="{ 'item-list__item--frameless': frameless }"
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
import { defineComponent } from 'vue'
import UserAvatar from '../UserAvatar/index.vue'

export default defineComponent({
  components: { UserAvatar },
  props: {
    user: { type: Object, required: true },
    frameless: { type: Boolean, default: false },
  },
})
</script>
