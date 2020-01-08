<template>
  <div class="entity-metadata">
    <div
      v-for="(data, index) in metadata"
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
              v-for="(item, itemIndex) in data.items"
              :key="itemIndex"
            >
              <a
                v-if="item.uri"
                :href="item.uri"
                target="_blank"
              >
                {{ item.label }}
              </a>
              <template v-else>
                {{ item.label }}
              </template>
            </li>
          </ul>
        </template>
        <template v-else>
          <a
            v-if="data.uri"
            :href="data.uri"
            target="_blank"
          >
            {{ data.value }}
          </a>
          <template v-else>
            {{ data.value }}
          </template>
        </template>
      </p>
    </div>
  </div>
</template>
<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class EntityMetadata extends Vue {
  @Prop({ type: Array, default: [] })
  readonly metadata: Array<any>
}
</script>
