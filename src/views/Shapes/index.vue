<template>
  <div>
    <page
      title="Shapes"
      content-only
    >
      <template v-slot:actions>
        <router-link
          to="/shapes/create"
          data-cy="create-shape"
        >
          + Create shape
        </router-link>
      </template>
      <template v-slot:content>
        <status-flash :status="status" />
        <div class="item-list">
          <item-simple
            v-for="shape in shapes"
            :key="shape.uuid"
            :avatar-initials="shape.name[0]"
            :avatar-value="shape.uuid"
          >
            <template v-slot:name>
              <router-link
                :to="`/shapes/${shape.uuid}`"
                data-cy="shape-link"
              >
                {{ shape.name }}
                <b-badge
                  v-if="shape.type === 'INTERNAL'"
                  pill
                  variant="light"
                >
                  Internal
                </b-badge>
              </router-link>
            </template>
            <template v-slot:actions>
              <b-dropdown
                v-if="shape.type === 'CUSTOM'"
                text="Actions"
                right
                variant="link"
                no-caret
              >
                <template v-slot:button-content>
                  <fa :icon="['fas', 'ellipsis-v']" />
                </template>
                <b-dropdown-item
                  @click="$router.push(`/shapes/${shape.uuid}`)"
                >
                  <fa :icon="['fas', 'edit']" />
                  Edit shape
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  class="dropdown-item-danger"
                  @click.prevent="deleteShape(shape)"
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
export default class Shapes extends Vue {
  status: Status = new Status()

  shapes: any = null

  created() {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData() {
    try {
      this.status.setPending()
      const response = await api.shapes.getShapes()
      this.shapes = _.orderBy(response.data, ['name'], ['asc'])
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get shapes.')
    }
  }

  async deleteShape(shape) {
    if (window.confirm(`Are you sure you want to delete ${shape.name}?`)) {
      try {
        await api.shapes.deleteShape(shape)
        this.fetchData()
      } catch (error) {
        this.status.setError('Unable to delete shape')
      }
    }
  }
}
</script>
