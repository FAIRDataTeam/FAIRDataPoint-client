<template>
  <EntitySettings :config="config" />
</template>
<script>
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntitySettings from '../../components/EntitySettings'

export default {
  name: 'DatasetSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getEntity: api.dataset.getDataset,
        getEntityMembers: api.dataset.getDatasetMembers,
        putEntityMember: api.dataset.putDatasetMember,
        deleteEntityMember: api.dataset.deleteDatasetMember,
        entityType: 'DATASET',
        createBreadcrumbs: breadcrumbs.fromLinksWithDataset,
      },
    }
  },
}
</script>
