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
        api: api.builder.build('distribution'),
        getSubject: rdfUtils.distributionSubject,
        entityType: 'DISTRIBUTION',
        createBreadcrumbs: breadcrumbs.fromWithDistribution,
      },
    }
  },
}
</script>
