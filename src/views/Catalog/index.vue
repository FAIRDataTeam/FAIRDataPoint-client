<template>
  <entity-view :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import api from '../../api'
import EntityView from '@/components/EntityView/index.vue'
import rdfUtils from '@/rdf/utils'
import { DCAT, DCT, FDPO } from '@/rdf/namespaces'
import metadata from '@/utils/metadata'
import breadcrumbs from '@/utils/breadcrumbs'
import urls from '@/utils/urls'

@Component({
  components: {
    EntityView,
  },
})
export default class Catalog extends Vue {
  get config() {
    return {
      api: api.builder.build('catalog'),
      getSubject: rdfUtils.catalogSubject,
      createItemList: this.createDatasets,
      createBreadcrumbs: breadcrumbs.fromCatalog,
      actions: ['edit', 'settings', 'delete'],
      getEntityMetadata: this.getEntityMetadata,
    }
  }

  createDatasets(graph) {
    const items = graph.findAll(DCAT('dataset'), { value: false }).map((dataset) => {
      const datasetId = rdfUtils.pathTerm(_.get(dataset, 'value'))
      const options = { subject: dataset }

      return {
        title: graph.findOne(DCT('title'), options),
        link: urls.dataset(datasetId),
        description: graph.findOne(DCT('description'), options),
        tags: graph.findAll(DCAT('theme'), options).map(metadata.itemFromPath),
        metadata: [
          metadata.dateField('Issued:', graph.findOne(FDPO('metadataIssued'), options)),
          metadata.dateField('Modified:', graph.findOne(FDPO('metadataModified'), options)),
        ],
      }
    })

    return {
      title: 'Datasets',
      dataCy: 'datasets',
      items,
    }
  }

  getEntityMetadata(graph) {
    const themeTaxonomies = graph.findAll(DCAT('themeTaxonomy')).map(metadata.itemFromPath)
    return [metadata.field('Theme taxonomies', themeTaxonomies)]
  }
}
</script>
