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
import urls from '@/utils/urls'
import formModels from '@/rdf/formModels'
import repositoryConfig from '@/entity/RepositoryConfig'


@Component({ components: { EntityView } })
export default class Repository extends Vue {
  config = repositoryConfig

// {
//     api: api.repository,
//     getSubject: rdfUtils.repositorySubject,
//     createItemList: this.createCatalogs,
//     getCreateItemUrl: urls.createCatalog,
//     canCreateItem: () => this.isAuthenticated,
//     actions: ['edit'],
//     formModel: formModels.repository,
//   }
//
//   get isAuthenticated(): boolean {
//     return this.$store.getters['auth/authenticated']
//   }
//
//   createCatalogs(graph) {
//     const items = graph.findAll(R3D('dataCatalog'), { value: false }).map((catalog) => {
//       const catalogId = rdfUtils.pathTerm(_.get(catalog, 'value'))
//       const options = { subject: catalog }
//
//       return {
//         title: graph.findOne(DCT('title'), options),
//         link: `/catalog/${catalogId}`,
//         description: graph.findOne(DCT('description'), options),
//         tags: graph.findAll(DCAT('themeTaxonomy'), options).map(metadata.itemFromPath),
//         metadata: [
//           metadata.dateField('Issued:', graph.findOne(FDPO('metadataIssued'), options)),
//           metadata.dateField('Modified:', graph.findOne(FDPO('metadataModified'), options)),
//         ],
//       }
//     })
//
//     return {
//       title: 'Catalogs',
//       dataCy: 'catalogs',
//       items,
//     }
//   }
}
</script>
