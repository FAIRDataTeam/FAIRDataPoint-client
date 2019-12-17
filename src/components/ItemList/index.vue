<template>
  <div class="item-list">
    <h2 v-if="items.length > 0">
      {{ title }}
    </h2>
    <item
      v-for="(item, index) in sortByTitle(items)"
      :key="index"
      :item="item"
    />
  </div>
</template>
<script>
import _ from 'lodash'
import Item from '../Item'

export default {
  name: 'ItemList',
  components: { Item },
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    sortByTitle(list) {
      return _.orderBy(list, ['title'], ['asc'])
    },
  },
}
</script>
