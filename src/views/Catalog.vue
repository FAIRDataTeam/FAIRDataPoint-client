<template>
  <div>
    <Breadcrumbs
      :links="links"
      current="Catalog"
    />
    <Page title="Catalog">
      <template v-slot:column>
        <Metadata :metadata="data" />
      </template>
      <template v-slot:content>
        <p class="description">
          This is catalog description.
        </p>
        <ItemList
          title="Datasets"
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
  name: 'Catalog',
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
        title: 'Dataset',
        description: 'Dataset description.',
        link: '/fdp/dataset/dataset-1',
      }],
      links: [{
        label: 'My FDP',
        to: '/fdp',
      }],
    }
  },
}
</script>
<style scoped lang="scss">

</style>
