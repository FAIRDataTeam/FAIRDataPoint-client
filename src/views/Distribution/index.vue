<template>
  <entity-view :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityView from '@/components/EntityView/index.vue'
import rdfUtils from '@/rdf/utils'
import { DCAT } from '@/rdf/namespaces'
import metadata from '@/utils/metadata'


@Component({ components: { EntityView } })
export default class Distribution extends Vue {
  get config() {
    return {
      getSubject: rdfUtils.distributionSubject,
      getEntity: api.distribution.getDistribution,
      getMembership: api.distribution.getDistributionMembership,
      createBreadcrumbs: breadcrumbs.fromDistribution,
      actions: ['edit', 'settings', 'delete'],
      getEntityMetadata: this.getEntityMetadata,
      getExtraActions: this.getExtraActions,
      deleteEntity: api.distribution.deleteDistribution,
    }
  }

  getEntityMetadata(graph) {
    const mediaType = graph.findOne(DCAT('mediaType'))
    return [metadata.field('Media Type', mediaType)]
  }

  getExtraActions(graph) {
    const accessUrl = graph.findOne(DCAT('accessURL'))
    const downloadUrl = graph.findOne(DCAT('downloadURL'))
    const res = []

    if (accessUrl) {
      res.push({
        label: 'Access online',
        url: accessUrl,
        icon: ['fas', 'external-link-alt'],
      })
    }

    if (downloadUrl) {
      res.push({
        label: 'Download',
        url: downloadUrl,
        icon: ['fas', 'download'],
      })
    }

    return res
  }
}
</script>
