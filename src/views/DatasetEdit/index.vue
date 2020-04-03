<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit/index.vue'
import urls from '../../utils/urls'
import rdfUtils from '@/rdf/utils'
import { SHACLParser } from '@/components/ShaclForm/SHACLParser'

export default {
  name: 'DatasetEdit',
  components: { EntityEdit },
  data() {
    return {
      config: {
        api: api.builder.build('dataset'),
        shape: 'DatasetShape',
        getSubject: rdfUtils.datasetSubject,
        toUrl: urls.dataset,
        createBreadcrumbs: breadcrumbs.fromWithDataset,
        filter: SHACLParser.filterBlacklist([
          'http://purl.org/dc/terms/accessRights',
          'http://purl.org/dc/terms/conformsTo',
          'http://www.w3.org/ns/dcat#contactPoint',
          'http://purl.org/dc/terms/creator',
          'http://purl.org/dc/terms/issued',
          'http://purl.org/dc/terms/modified',
          'http://purl.org/dc/terms/publisher',
          'http://purl.org/dc/terms/identifier',
          'http://purl.org/dc/terms/type',
          'http://purl.org/dc/terms/relation',
          'http://www.w3.org/ns/dcat#qualifiedRelation',
          'http://www.w3.org/ns/dcat#landingPage',
          'http://www.w3.org/ns/prov#qualifiedAttribution',
          'http://purl.org/dc/terms/rights',
          'http://www.w3.org/ns/odrl/2/hasPolicy',
          'http://purl.org/dc/terms/isReferencedBy',
          'http://www.w3.org/ns/dcat#distribution',
          'http://www.w3.org/ns/dcat#spatialResolutionInMeters',
          'http://www.w3.org/ns/dcat#temporalResolution',
          'http://purl.org/dc/terms/accrualPeriodicity',
          'http://purl.org/dc/terms/spatial',
          'http://purl.org/dc/terms/temporal',
          'http://www.w3.org/ns/prov#wasGeneratedBy',
          'http://purl.org/dc/terms/isPartOf',
        ]),
      },
    }
  },
}
</script>
