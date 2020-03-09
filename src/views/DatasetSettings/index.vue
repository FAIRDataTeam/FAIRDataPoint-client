<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntitySettings from '../../components/EntitySettings/index.vue'
import rdfUtils from '@/rdf/utils'

export default {
  name: 'DatasetSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getSubject: rdfUtils.datasetSubject,
        getEntity: api.dataset.getDataset,
        getEntityMembers: api.dataset.getDatasetMembers,
        putEntityMember: api.dataset.putDatasetMember,
        deleteEntityMember: api.dataset.deleteDatasetMember,
        entityType: 'DATASET',
        createBreadcrumbs: breadcrumbs.fromWithDataset,
      },
    }
  },
}
</script>
