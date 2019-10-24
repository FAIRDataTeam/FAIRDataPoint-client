<template>
  <div>
    <Page
      title="Users"
      content-only
    >
      <template v-slot:content>
        Users page.
      </template>
    </Page>
  </div>
</template>
<script>
import Page from '../components/Page.vue'

export default {
  name: 'Users',
  components: { Page },
}
</script>
