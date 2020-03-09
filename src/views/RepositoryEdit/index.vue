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
        shape: 'RepositoryShape',
        subject: rdfUtils.repositorySubject(),
        getSubject: rdfUtils.repositorySubject,
        getEntity: api.repository.getRepository,
        getEntitySpec: api.repository.getRepositorySpec,
        getMembership: () => Promise.resolve({ data: {} }),
        putEntity: (_, data) => api.repository.putRepository(data),
        toUrl: urls.repository,
        createBreadcrumbs: breadcrumbs.fromRepository,
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
          'http://www.re3data.org/schema/3-0#publicationSupport',
          'http://www.re3data.org/schema/3-0#dataAccess',
          'http://www.re3data.org/schema/3-0#dataUpload',
          'http://www.re3data.org/schema/3-0#databaseAccess',
          'http://www.re3data.org/schema/3-0#dataLicense',
          'http://www.re3data.org/schema/3-0#dataUploadLicense',
          'http://www.re3data.org/schema/3-0#databaseLicense',
          'http://www.re3data.org/schema/3-0#policy',
          'http://www.re3data.org/schema/3-0#api',
          'http://www.re3data.org/schema/3-0#metadataStandard',
          'http://www.re3data.org/schema/3-0#certificate',
          'http://www.re3data.org/schema/3-0#syndication',
          'http://www.re3data.org/schema/3-0#repositoryType',
          'http://www.re3data.org/schema/3-0#providerType',
          'http://www.re3data.org/schema/3-0#repositoryLanguage',
          'http://www.re3data.org/schema/3-0#contentType',
          'http://www.re3data.org/schema/3-0#re3data',
          'http://www.re3data.org/schema/3-0#subject',
          'http://www.re3data.org/schema/3-0#doi',
          'http://www.re3data.org/schema/3-0#repositoryIdentifier',
          'http://www.re3data.org/schema/3-0#repositoryPost',
          'http://www.re3data.org/schema/3-0#institution',
          'http://www.re3data.org/schema/3-0#dataCatalog',
          'http://www.re3data.org/schema/3-0#startDate',
          'http://www.re3data.org/schema/3-0#entryDate',
          'http://www.re3data.org/schema/3-0#closed',
          'http://www.re3data.org/schema/3-0#offline',
          'http://www.re3data.org/schema/3-0#metrics',
          'http://www.re3data.org/schema/3-0#size',
          'http://www.re3data.org/schema/3-0#software',
          'http://www.re3data.org/schema/3-0#hasVersioning',
          'http://www.re3data.org/schema/3-0#hasQualityManagement',
        ]),
      },
    }
  },
}
</script>
