<template>
  <entity-view :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import api from '@/api'
import metadata from '@/utils/metadata'
import rdfUtils from '@/rdf/utils'
import EntityView from '@/components/EntityView/index.vue'
import {
  DCAT, DCT, FDPO, R3D,
} from '@/rdf/namespaces'


@Component({
  components: { EntityView },
})
export default class Repository extends Vue {
  get config() {
    return {
      getSubject: rdfUtils.repositorySubject,
      getEntity: api.repository.getRepository,
      getMembership: () => Promise.resolve({ data: {} }),
      createItemList: this.createCatalogs,
      actions: ['edit', 'delete'],
      getEntityMetadata: () => [],
      deleteEntity: api.repository.deleteRepository,
    }
  }

  createCatalogs(graph) {
    const items = graph.findAll(R3D('dataCatalog'), { value: false }).map((catalog) => {
      const catalogId = rdfUtils.pathTerm(_.get(catalog, 'value'))
      const options = { subject: catalog }

      return {
        title: graph.findOne(DCT('title'), options),
        link: `/catalog/${catalogId}`,
        description: graph.findOne(DCT('description'), options),
        tags: graph.findAll(DCAT('themeTaxonomy'), options).map(metadata.itemFromPath),
        metadata: [
          metadata.dateField('Issued:', graph.findOne(FDPO('metadataIssued'), options)),
          metadata.dateField('Modified:', graph.findOne(FDPO('metadataModified'), options)),
        ],
      }
    })

    return {
      title: 'Catalog',
      dataCy: 'catalogs',
      items,
    }
  }
}
</script>
