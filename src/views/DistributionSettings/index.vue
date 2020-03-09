<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntitySettings from '../../components/EntitySettings/index.vue'
import rdfUtils from '@/rdf/utils'

export default {
  name: 'DistributionSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getSubject: rdfUtils.distributionSubject,
        getEntity: api.distribution.getDistribution,
        getEntityMembers: api.distribution.getDistributionMembers,
        putEntityMember: api.distribution.putDistributionMember,
        deleteEntityMember: api.distribution.deleteDistributionMember,
        entityType: 'DISTRIBUTION',
        createBreadcrumbs: breadcrumbs.fromWithDistribution,
      },
    }
  },
}
</script>
