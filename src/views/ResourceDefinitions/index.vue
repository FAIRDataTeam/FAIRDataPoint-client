<template>
  <div>
    <page
      title="Resource definitions"
      content-only
    >
      <template v-slot:actions>
        <router-link
          to="/resource-definitions/create"
          data-cy="create-resourceDefinition"
        >
          + Create resource definition
        </router-link>
      </template>
      <template v-slot:content>
        <status-flash :status="status" />
        <div class="item-list">
          <item-simple
            v-for="resourceDefinition in resourceDefinitions"
            :key="resourceDefinition.uuid"
            :avatar-initials="resourceDefinition.name[0]"
            :avatar-value="resourceDefinition.uuid"
          >
            <template v-slot:name>
              <router-link
                :to="`/resource-definitions/${resourceDefinition.uuid}`"
                data-cy="resource-definition-link"
              >
                {{ resourceDefinition.name }}
              </router-link>
            </template>
            <template v-slot:actions>
              <b-dropdown
                text="Actions"
                right
                variant="link"
                no-caret
              >
                <template v-slot:button-content>
                  <fa :icon="['fas', 'ellipsis-v']" />
                </template>
                <b-dropdown-item
                  @click="$router.push(`/resource-definitions/${resourceDefinition.uuid}`)"
                >
                  <fa :icon="['fas', 'edit']" />
                  Edit resource definition
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  class="dropdown-item-danger"
                  @click.prevent="deleteResourceDefinition(resourceDefinition)"
                >
                  <fa :icon="['far', 'trash-alt']" />
                  Remove
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </item-simple>
        </div>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import api from '../../api'
import ItemSimple from '../../components/ItemSimple/index.vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '../../components/StatusFlash/index.vue'

@Component({ components: { Page, StatusFlash, ItemSimple } })
export default class ResourceDefinitions extends Vue {
  status: Status = new Status()

  resourceDefinitions: any = null

  created() {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData() {
    try {
      this.status.setPending()
      const response = await api.resourceDefinition.getResourceDefinitions()
      this.resourceDefinitions = _.orderBy(response.data, ['name'], ['asc'])
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get resourceDefinitions.')
    }
  }

  async deleteResourceDefinition(resourceDefinition) {
    if (window.confirm(`Are you sure you want to delete ${resourceDefinition.name}?`)) {
      try {
        await api.resourceDefinition.deleteResourceDefinition(resourceDefinition)
        this.fetchData()
      } catch (error) {
        this.status.setError('Unable to delete resource definition')
      }
    }
  }
}
</script>
