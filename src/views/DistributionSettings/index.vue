<template>
  <entity-settings :config="config" />
</template>
<script>
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntitySettings from '../../components/EntitySettings'

export default {
  name: 'DistributionSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getEntity: api.distribution.getDistribution,
        getEntityMembers: api.distribution.getDistributionMembers,
        putEntityMember: api.distribution.putDistributionMember,
        deleteEntityMember: api.distribution.deleteDistributionMember,
        entityType: 'DISTRIBUTION',
        createBreadcrumbs: breadcrumbs.fromLinksWithDistribution,
      },
    }
  },
}
</script>
