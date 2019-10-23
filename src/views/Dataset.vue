<template>
  <div>
    <Breadcrumbs
      :links="links"
      current="Dataset"
    />
    <Page title="Dataset">
      <template v-slot:column>
        <Metadata :metadata="data" />
      </template>
      <template v-slot:content>
        <p class="description">
          This is dataset description.
        </p>
        <ItemList
          title="Distributions"
          :items="items"
        />
      </template>
    </Page>
  </div>
</template>
<script>
import Breadcrumbs from '../components/Breadcrumbs.vue'
import ItemList from '../components/ItemList.vue'
import Metadata from '../components/Metadata.vue'
import Page from '../components/Page.vue'

export default {
  name: 'Dataset',
  components: {
    Breadcrumbs,
    ItemList,
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
      items: [{
        title: 'Distribution',
        description: 'Distribution description.',
        link: '/fdp/distribution/distribution-1',
      }],
      links: [{
        label: 'My FDP',
        to: '/fdp',
      }, {
        label: 'Catalog',
        to: '/fdp/catalog/catalog-1',
      }],
    }
  },
}
</script>
<style scoped lang="scss">

</style>
