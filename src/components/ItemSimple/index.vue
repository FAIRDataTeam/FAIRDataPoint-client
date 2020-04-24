<template>
  <div
    class="item-list__item"
    :class="{'item-list__item--frameless': frameless}"
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import Avatar from '../Avatar/index.vue'

@Component({
  components: { Avatar },
})
export default class ItemSimple extends Vue {
  @Prop({ required: true })
  readonly avatarInitials: any

  @Prop({ required: true })
  readonly avatarValue: any

  @Prop({ type: Boolean, default: false })
  readonly frameless: boolean
}
</script>
