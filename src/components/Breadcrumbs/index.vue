<template>
  <div class="breadcrumbs">
    <div class="breadcrumbs__container">
      <ul>
        <li
          v-for="(link, index) in links"
          :key="index"
        >
          <router-link :to="link.to">
            {{ link.label }}
          </router-link>
        </li>
        <li>{{ current }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Breadcrumbs',
  props: {
    links: {
      type: Array,
      required: true,
    },
    current: {
      type: String,
      required: true,
    },
  },
}
</script>
