<template>
  <div class="item">
    <router-link
      :to="item.link"
      class="item__title"
    >
      {{ item.title }}
    </router-link>
    <p
      v-if="item.description"
      class="item__description"
    >
      {{ item.description | truncate }}
    </p>
    <div
      v-if="item.tags"
      class="item__tags"
    >
      <a
        v-for="(tag, index) in item.tags"
        :key="index"
        :href="tag.uri"
        class="item__tags__tag"
        target="_blank"
      >
        {{ tag.label }}
      </a>
    </div>
    <dl
      v-if="item.metadata"
      class="item__metadata"
    >
      <template v-for="(metadata, index) in item.metadata">
        <dt :key="index + '_label'">
          {{ metadata.label }}
        </dt>
        <dd :key="index + '_value'">
          {{ metadata.value }}
        </dd>
      </template>
    </dl>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Item extends Vue {
  @Prop({ required: true })
  readonly item: any
}
</script>
