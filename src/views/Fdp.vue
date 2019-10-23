<template>
  <Page>
    <template v-slot:column>
      <Metadata :metadata="data" />
    </template>
    <template v-slot:content>
      <p class="description">
        This is FDP description.
      </p>
      <ItemList
        title="Catalogs"
        :items="items"
      />
    </template>
  </Page>
</template>
<script>
import ItemList from '../components/ItemList.vue'
import Metadata from '../components/Metadata.vue'
import Page from '../components/Page.vue'

export default {
  name: 'Fdp',
  components: {
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
        title: 'Catalog',
        description: 'Catalog description.',
        link: '/fdp/catalog/catalog-1',
      }],
    }
  },
}
</script>
<style scoped lang="scss">

</style>
