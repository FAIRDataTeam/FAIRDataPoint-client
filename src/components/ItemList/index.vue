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
<script lang="ts">
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Item from '../Item/index.vue'


@Component({
  components: { Item },
})
export default class ItemList extends Vue {
  @Prop({ type: String, required: true })
  readonly title: string

  @Prop({ type: Array, required: true })
  readonly items: Array<any>

  sortByTitle(list) {
    return _.orderBy(list, ['title'], ['asc'])
  }
}
</script>
