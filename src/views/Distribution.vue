<template>
  <Page title="Distribution">
    <template v-slot:column>
      <Metadata :metadata="data" />
    </template>
    <template v-slot:content>
      <p class="description">
        This is dataset description.
      </p>
    </template>
  </Page>
</template>
<script>
import Metadata from '../components/Metadata.vue'
import Page from '../components/Page.vue'

export default {
  name: 'Distribution',
  components: {
    Metadata,
    Page,
  },

  data() {
    return {
      data: [{
        label: 'Issued',
        value: 'abcd',
        sm: true,
      }, {
        label: 'Modified',
        value: 'safda',
        sm: true,
      }, {
        label: 'Something',
        value: 'This is something',
        uri: 'http://example.com',
      }],
    }
  },
}
</script>
<style scoped lang="scss">

</style>
