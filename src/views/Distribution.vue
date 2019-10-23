<template>
  <div>
    <Breadcrumbs
      :links="links"
      current="Distribution"
    />
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
  </div>
</template>
<script>
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Metadata from '../components/Metadata.vue'
import Page from '../components/Page.vue'

export default {
  name: 'Distribution',
  components: {
    Breadcrumbs,
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
      links: [{
        label: 'My FDP',
        to: '/fdp',
      }, {
        label: 'Catalog',
        to: '/fdp/catalog/catalog-1',
      }, {
        label: 'Dataset',
        to: '/fdp/dataset/dataset-1',
      }],
    }
  },
}
</script>
<style scoped lang="scss">

</style>
