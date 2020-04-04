<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit/index.vue'
import urls from '../../utils/urls'
import rdfUtils from '@/rdf/utils'
import { SHACLParser } from '@/components/ShaclForm/SHACLParser'
import fieldBlacklist from '@/rdf/fieldBlacklist'

@Component({ components: { EntityEdit } })
export default class DistributionEdit extends Vue {
  config = {
    api: api.repository,
    shape: 'RepositoryShape',
    subject: rdfUtils.repositorySubject(),
    getSubject: rdfUtils.repositorySubject,
    toUrl: urls.repository,
    createBreadcrumbs: breadcrumbs.fromRepository,
    filter: SHACLParser.filterBlacklist(fieldBlacklist.repository),
  }
}
</script>
