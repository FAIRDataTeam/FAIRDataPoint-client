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
      {{ item.description }}
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
<script>
export default {
  name: 'Item',
  props: {
    item: {
      validator: value => value !== null,
      required: true,
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/mixins";
@import "../scss/typography";

.item {
  @include border-radius($border-radius-default);
  background: $color-background-highlighted;
  margin-bottom: $space-md;
  padding: $space-md;

  &__title {
    @include typography-primary-18-bold;
    text-decoration: none;

    &:hover {
      color: $color-primary-lighter;
    }
  }

  &__description {
    @include typography-default-16;
    margin: $space-sm 0;
    text-align: justify;
  }

  &__tags {
    margin: $space-sm 0 $space-xs 0;

    &__tag {
      @include typography-primary-14;
      @include border-radius($border-radius-full);
      display: inline-block;
      background: $color-background-primary;
      padding: $space-xs $space-sm;
      margin-bottom: $space-xs;
      margin-right: $space-sm;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__metadata {
    margin: 0;

    dt {
      @include typography-default-14-bold;
      display: inline-block;
      margin: 0;
    }

    dd {
      @include typography-default-14;
      display: inline-block;
      margin: 0 $space-md 0 $space-xs;
    }
  }
}
</style>
