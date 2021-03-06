<template>
  <div class="entity-metadata">
    <div
      v-for="(data, index) in filteredMetadata"
      :key="index"
      class="entity-metadata__item"
      :class="{
        'entity-metadata__item--sm': data.sm,
      }"
    >
      <h3>{{ data.label }}</h3>
      <p>
        <template v-if="data.links">
          <a
            v-for="(link, linkIndex) in data.links"
            :key="linkIndex"
            :href="link.uri"
            target="_blank"
            class="link"
          >
            {{ link.label }}
          </a>
        </template>
        <template v-else-if="data.items">
          <ul>
            <li
              v-for="(item, itemIndex) in viewItems(index, data.items)"
              :key="itemIndex"
            >
              <rdf-link
                v-if="item.uri"
                :uri="item.uri"
                :label="item.label"
              />
              <template v-else>
                {{ item.label }}
              </template>
            </li>
          </ul>
          <a
            v-if="showMoreActive(index, data.items)"
            class="show-more-link"
            @click.prevent="addViewAll(index)"
          >
            <fa :icon="['fas', 'chevron-down']" />
            Show more
          </a>
          <a
            v-if="showLessActive(index, data.items)"
            class="show-more-link"
            @click.prevent="removeViewAll(index)"
          >
            <fa :icon="['fas', 'chevron-up']" />
            Show less
          </a>
        </template>
        <template v-else>
          <rdf-link
            v-if="data.uri"
            :uri="data.uri"
            :label="data.value"
          />
          <template v-else>
            {{ data.value }}
          </template>
        </template>
      </p>
    </div>
  </div>
</template>
<script lang="ts">

import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import RdfLink from '@/components/RdfLink/index.vue'

@Component({ components: { RdfLink } })
export default class EntityMetadata extends Vue {
  @Prop({ type: Array, default: [] })
  readonly metadata: Array<any>

  viewAll = []

  get filteredMetadata() {
    if (!this.metadata) return []
    return this.metadata.filter(data => !data.items || data.items.length > 0)
  }

  viewItems(key, items) {
    if (this.showMoreActive(key, items)) {
      return items.slice(0, 3)
    }
    return items
  }

  showMoreActive(key, items) {
    return items.length > 4 && !this.getViewAll(key)
  }

  showLessActive(key, items) {
    return items.length > 4 && this.getViewAll(key)
  }

  getViewAll(key) {
    return _.includes(this.viewAll, key)
  }

  addViewAll(key) {
    this.viewAll.push(key)
  }

  removeViewAll(key) {
    this.viewAll = this.viewAll.filter(i => i !== key)
  }
}
</script>
