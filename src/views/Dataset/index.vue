<template>
  <entity-view :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import api from '../../api'
import EntityView from '@/components/EntityView/index.vue'
import breadcrumbs from '../../utils/breadcrumbs'
import rdfUtils from '@/rdf/utils'
import { DCAT, DCT, FDPO } from '@/rdf/namespaces'
import urls from '@/utils/urls'
import metadata from '@/utils/metadata'
import permissions from '@/utils/permissions'


@Component({ components: { EntityView } })
export default class Dataset extends Vue {
  config = {
    api: api.builder.build('dataset'),
    getSubject: rdfUtils.datasetSubject,
    createItemList: this.createDistributions,
    createBreadcrumbs: breadcrumbs.fromDataset,
    getCreateItemUrl: urls.createDistribution,
    canCreateItem: permissions.hasCreate,
    actions: ['edit', 'settings', 'delete'],
    getEntityMetadata: this.getEntityMetadata,
  }

  createDistributions(graph) {
    const items = graph.findAll(DCAT('distribution'), { value: false }).map((distribution) => {
      const distributionId = rdfUtils.pathTerm(_.get(distribution, 'value'))
      const options = { subject: distribution }

      return {
        title: graph.findOne(DCT('title'), options),
        link: urls.distribution(distributionId),
        description: graph.findOne(DCT('description'), options),
        metadata: [
          metadata.field('Media Type', graph.findOne(DCAT('mediaType'), options)),
          metadata.dateField('Issued', graph.findOne(FDPO('metadataIssued'), options)),
          metadata.dateField('Modified', graph.findOne(FDPO('metadataModified'), options)),
        ],
      }
    })

    return {
      title: 'Distributions',
      dataCy: 'distributions',
      items,
    }
  }

  getEntityMetadata(graph) {
    const keywords = graph.findAll(DCAT('keyword')).map(label => ({ label }))
    const themes = graph.findAll(DCAT('theme')).map(metadata.itemFromPath)
    return [
      metadata.field('Themes', themes),
      metadata.field('Keyword', keywords),
    ]
  }
}
</script>
