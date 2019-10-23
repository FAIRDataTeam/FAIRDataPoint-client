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
@import "../scss/text-styles";


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

    &--list {
      ul {
        margin: 0;
        padding-left: 1.25rem;

        li {
          @include text-style-dark-18-semibold;
          word-break: break-word;
          margin-top: $space-sm;
        }
      }
    }

    h3 {
      @include text-style-lighter-16-semibold;
      margin: 0;
    }

    a {
      @include text-style-dark-18-semibold;
      @include transition-default(color);

      &:hover {
        color: $color-primary;
      }
    }

    p {
      @include text-style-dark-18-semibold;
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
