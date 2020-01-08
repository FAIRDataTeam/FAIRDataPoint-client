<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit/index.vue'
import urls from '../../utils/urls'

export default {
  name: 'DistributionEdit',
  components: { EntityEdit },

  data() {
    return {
      config: {
        getEntity: api.repository.getRepository,
        getEntitySpec: api.repository.getRepositorySpec,
        putEntity: (_, data) => api.repository.putRepository(data),
        toUrl: urls.repository,
        createBreadcrumbs: breadcrumbs.fromRepository,
      },
    }
  },
}
</script>
