<template>
  <div
    class="item-list__item"
    :class="{ 'item-list__item--frameless': frameless }"
    data-cy="user-item"
  >
    <avatar
      :initials="avatarInitials"
      :value="avatarValue"
      smaller
    />
    <div class="item-list__item__content">
      <div class="item-list__item__content__row">
        <slot name="name" />
      </div>
    </div>
    <div class="item-list__item__actions">
      <slot name="actions" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Avatar from '../Avatar/index.vue'

export default defineComponent({
  components: { Avatar },
  props: {
    avatarInitials: { type: [String, Number], required: true },
    avatarValue: { type: [String, Number], required: true },
    frameless: { type: Boolean, default: false },
  },
})
</script>
