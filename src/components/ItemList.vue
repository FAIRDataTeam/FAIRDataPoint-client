<template>
  <div class="item-list">
    <h2 v-if="items.length > 0">
      {{ title }}
    </h2>
    <Item
      v-for="(item, index) in items"
      :key="index"
      :item="item"
    />
  </div>
</template>
<script>
import Item from './Item.vue'

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
}
</script>
