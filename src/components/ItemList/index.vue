<template>
  <div class="item-list">
    <div class="item-list__header">
      <h2>
        {{ title }}
      </h2>
      <router-link
        v-if="createLink"
        class="btn btn-link"
        :to="createLink"
        data-cy="create"
      >
        <fa :icon="['fas', 'plus']" />
        Create
      </router-link>
    </div>
    <div
      v-if="items.length === 0"
      class="item-list__empty"
    >
      {{ emptyText }}
    </div>
    <item
      v-for="(item, index) in sortByTitle(items)"
      :key="index"
      :item="item"
      data-cy="item"
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

  @Prop({ type: String, required: false, default: null })
  readonly createLink: string

  get emptyText() {
    return `There are no ${_.toLower(this.title)}.`
  }

  sortByTitle(list) {
    return _.orderBy(list, ['title'], ['asc'])
  }
}
</script>
