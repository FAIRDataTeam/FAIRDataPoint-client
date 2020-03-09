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
  name: 'DistributionEdit',
  components: { EntityEdit },

  data() {
    return {
      config: {
        shape: 'DistributionShape',
        getSubject: rdfUtils.distributionSubject,
        getEntity: api.distribution.getDistribution,
        getEntitySpec: api.distribution.getDistributionSpec,
        getMembership: api.distribution.getDistributionMembership,
        putEntity: api.distribution.putDistribution,
        toUrl: urls.distribution,
        createBreadcrumbs: breadcrumbs.fromWithDistribution,
        filter: SHACLParser.filterBlacklist([
          'http://purl.org/dc/terms/accessRights',
          'http://purl.org/dc/terms/conformsTo',
          'http://www.w3.org/ns/dcat#contactPoint',
          'http://purl.org/dc/terms/creator',
          'http://purl.org/dc/terms/issued',
          'http://purl.org/dc/terms/modified',
          'http://purl.org/dc/terms/publisher',
          'http://purl.org/dc/terms/identifier',
          'http://www.w3.org/ns/dcat#theme',
          'http://purl.org/dc/terms/type',
          'http://purl.org/dc/terms/relation',
          'http://www.w3.org/ns/dcat#qualifiedRelation',
          'http://www.w3.org/ns/dcat#keyword',
          'http://www.w3.org/ns/dcat#landingPage',
          'http://www.w3.org/ns/prov#qualifiedAttribution',
          'http://purl.org/dc/terms/rights',
          'http://www.w3.org/ns/odrl/2/hasPolicy',
          'http://purl.org/dc/terms/isReferencedBy',
          'http://www.w3.org/ns/dcat#accessService',
          'http://www.w3.org/ns/dcat#spatialResolutionInMeters',
          'http://www.w3.org/ns/dcat#temporalResolution',
          'http://purl.org/dc/terms/isPartOf',
          'http://www.w3.org/ns/dcat#byteSize',
          'http://www.w3.org/ns/dcat#compressFormat',
          'http://www.w3.org/ns/dcat#packageFormat',
        ]),
      },
    }
  },
}
</script>
