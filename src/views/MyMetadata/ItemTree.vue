<template>
  <div
    v-if="modelValue && modelValue.length > 0"
    class="item-list"
  >
    <div
      v-for="item in sortByTitle(modelValue)"
      :key="item.uri"
      class="item-list__item"
    >
      <a
        v-if="item.children.length > 0"
        class="item-list__item__control"
        @click.prevent="toggleOpen(item)"
      >
        <fa :icon="['fas', item.open ? 'chevron-down' : 'chevron-right']" />
      </a>
      <span
        v-else
        class="item-list__item__control"
      />
      <avatar
        :initials="item.title[0]"
        :value="item.uri"
        smaller
      />
      <div class="item-list__item__content">
        <div class="item-list__item__content__row">
          <a :href="`${item.uri}`">
            {{ title(item) }}
          </a>
          <membership-badge :entity="item" />
        </div>
      </div>

      <item-tree
        v-if="item.open"
        v-model="item.children"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import _ from 'lodash'
import Avatar from '../../components/Avatar/index.vue'
import MembershipBadge from '../../components/MembershipBadge/index.vue'

type Item = {
  children: Item[]
}

export default defineComponent({
  name: 'ItemTree',
  components: {
    Avatar,
    MembershipBadge,
  },
  props: {
    modelValue: { type: Array as PropType<Item[]>, required: true },
  },
  emits: ['update:modelValue'],
  methods: {
    title(item) {
      return item.state === 'DRAFT' ? `[DRAFT] ${item.title}` : item.title
    },
    sortByTitle(list) {
      return _.orderBy(list, ['title'], ['asc'])
    },
    toggleOpen(entity) {
      this.changeOpen((current) => (
        current.uri === entity.uri ? !current.open : current.open
      ))
    },
    changeOpen(f) {
      this.$emit('update:modelValue', this.modelValue.map((c) => ({
        ...c,
        open: f(c),
        children: c.children.map((d) => ({
          ...d,
          open: f(d),
        })),
      })))
    },
  },
})
</script>
