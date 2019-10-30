<template>
  <div class="metadata">
    <div
      v-for="(data, index) in metadata"
      :key="index"
      class="metadata__item"
      :class="{
        'metadata__item--sm': data.sm,
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
<script>
export default {
  name: 'Metadata',
  props: {
    metadata: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/mixins";
@import "../scss/typography";


.metadata {
  &::after {
    content: '';
    display: table;
    clear: both;
  }

  .metadata__item {
    float: left;
    width: 100%;
    padding: $space-md 0;
    border-bottom: $border-width-line solid $color-separator;

    &:last-child {
      border-bottom: none;
    }

    &--sm {
      width: 50%;
    }

    ul {
      margin: 0;
      padding-left: 1.25rem;

      li {
        @include typography-dark-18-semibold;
        word-break: break-word;
        margin-top: $space-sm;
      }
    }

    h3 {
      @include typography-lighter-16-semibold;
      margin: 0;
    }

    a {
      @include typography-dark-18-semibold;
      @include transition-default(color);
      display: inline-block;
      text-decoration: underline;

      &:hover {
        color: $color-primary;
      }

      &.link:not(:last-child) {
        margin-right: $space-md;
      }
    }

    p {
      @include typography-dark-18-semibold;
      margin: 0;
      word-break: break-word;

      &.download-links {
        a {
          margin-right: $space-md;
        }
      }
    }
  }
}
</style>
