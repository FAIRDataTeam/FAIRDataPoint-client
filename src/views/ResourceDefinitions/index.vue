<template>
  <div>
    <page
      title="Resource definitions"
      content-only
    >
      <template #actions>
        <router-link
          to="/resource-definitions/create"
          data-cy="create-resourceDefinition"
        >
          + Create resource definition
        </router-link>
      </template>
      <template #content>
        <status-flash :status="status" />
        <div class="item-list">
          <item-simple
            v-for="resourceDefinition in resourceDefinitions"
            :key="resourceDefinition.uuid"
            :avatar-initials="resourceDefinition.name[0]"
            :avatar-value="resourceDefinition.uuid"
          >
            <template #name>
              <router-link
                :to="`/resource-definitions/${resourceDefinition.uuid}`"
                data-cy="resource-definition-link"
              >
                {{ resourceDefinition.name }}
              </router-link>
            </template>
            <template #actions>
              <b-dropdown
                text="Actions"
                right
                variant="link"
                no-caret
              >
                <template #button-content>
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
import { defineComponent } from 'vue'
import _ from 'lodash'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import api from '../../api'
import ItemSimple from '../../components/ItemSimple/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default defineComponent({
  components: { Page, StatusFlash, ItemSimple },
  data() {
    return {
      status: new Status(),
      resourceDefinitions: null,
    }
  },
  watch: {
    $route: 'fetchData',
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.status.setPending()
        const response = await api.resourceDefinition.getResourceDefinitions()
        this.resourceDefinitions = _.orderBy(response.data, ['name'], ['asc'])
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get resourceDefinitions.')
      }
    },
    async deleteResourceDefinition(resourceDefinition) {
      if (window.confirm(`Are you sure you want to remove ${resourceDefinition.name}?`)) {
        try {
          await api.resourceDefinition.deleteResourceDefinition(resourceDefinition)
          await this.fetchData()
        } catch (error) {
          this.status.setError('Unable to delete resource definition')
        }
      }
    },
  },
})
</script>
