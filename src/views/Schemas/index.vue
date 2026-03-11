<template>
  <div>
    <status-flash :status="status" />
    <page
      v-if="schemas"
      title="Metadata schemas"
      content-only
    >
      <template #actions>
        <router-link
          to="/schemas/create"
          data-cy="create-schema"
        >
          + Create
        </router-link>
        <router-link
          to="/schemas/import"
          data-cy="import-schemas"
        >
          Import
        </router-link>
        <router-link
          to="/schemas/update"
          data-cy="update-schemas"
        >
          Update
        </router-link>
      </template>
      <template #content>
        <ul
          class="nav nav-tabs"
        >
          <li
            class="nav-item"
          >
            <a
              class="nav-link"
              :class="{ active: !viewDiagram }"
              @click.prevent="setViewDiagram(false)"
            >
              List
            </a>
          </li>
          <li
            class="nav-item"
          >
            <a
              class="nav-link"
              :class="{ active: viewDiagram }"
              @click.prevent="setViewDiagram(true)"
            >
              Graph
            </a>
          </li>
        </ul>
        <diagram
          v-if="viewDiagram"
          style="height: 600px"
          :model-data="diagramData"
        />
        <div
          v-else
          class="item-list"
        >
          <item-simple
            v-for="schema in schemas"
            :key="schema.uuid"
            :avatar-initials="schema.name[0]"
            :avatar-value="schema.uuid"
          >
            <template #name>
              <router-link
                :to="`/schemas/${schema.uuid}`"
                data-cy="schema-link"
              >
                {{ schema.name }}
              </router-link>
              <b-badge
                v-if="latestVersion(schema)"
                pill
                variant="light"
              >
                {{ latestVersion(schema) }}
              </b-badge>
              <b-badge
                v-if="schema.draft"
                pill
                variant="info"
              >
                Draft
              </b-badge>
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
                  @click="$router.push(`/schemas/${schema.uuid}`)"
                >
                  <fa :icon="['fas', 'edit']" />
                  Edit schema
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  class="dropdown-item-danger"
                  @click.prevent="deleteMetadataSchema(schema)"
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
import Diagram from '@/components/Diagram/index.vue'
import api from '../../api'
import ItemSimple from '../../components/ItemSimple/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default defineComponent({
  components: {
    Diagram, Page, StatusFlash, ItemSimple,
  },
  data() {
    return {
      status: new Status(),
      schemas: null,
      viewDiagram: false,
    }
  },
  computed: {
    entrySchema() {
      const isEntryVersion = (version) => version.urlPrefix === '' && version.version !== null && !version.abstract
      const entryVersion = (schema) => {
        const version = schema.versions.find(isEntryVersion)
        if (version) {
          version.uuid = schema.uuid
        }
        return version
      }
      return this.schemas.reduce((result, schema) => result || entryVersion(schema), null)
    },
    diagramData() {
      const emptyDiagram = { nodes: [], edges: [] }

      if (!this.schemas) {
        return emptyDiagram
      }

      const schemas = this.schemas.reduce((acc, schema) => {
        if (schema.latest) {
          acc.push({ ...schema.latest, draft: false })
        } else if (schema.draft) {
          acc.push({ ...schema.draft, draft: true })
        }
        return acc
      }, [])

      let nodes = []
      const edges = []
      const levels = {}
      const processed = {}

      const createNode = (schema) => {
        const id = schema.uuid
        let label = `<b>${schema.name}</b>`
        let extraOptions = {}

        if (schema.abstractSchema) {
          label = `<i><<abstract>></i>\n${label}`
        }

        if (schema.draft) {
          extraOptions = {
            shapeProperties: {
              borderDashes: [10, 5],
            },
          }
        }

        return {
          id,
          label,
          shape: 'box',
          ...extraOptions,
        }
      }

      const createExtendsEdge = (childId, parentId) => ({
        from: childId,
        to: parentId,
        arrows: {
          to: {
            enabled: true,
            type: 'image',
            imageWidth: 16,
            imageHeight: 16,
            src: 'data:image/svg+xml,%3Csvg%20width%3D%2244px%22%20height%3D%2247px%22%20viewBox%3D%220%200%2044%2047%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cg%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%232B7CE9%22%20stroke-width%3D%223%22%3E%3Cpath%20d%3D%22M22%2C3.53823566%20L41.6416769%2C45.5%20L2.35832307%2C45.5%20L22%2C3.53823566%20Z%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
          },
        },
      })

      const isNotProcessed = (id) => !processed[id]

      const pushLevelUp = (id, level) => {
        if (level[id] < level) {
          levels[id] = level
        }
      }

      const processSchema = (level) => (schema) => {
        // create schema node and mark it as processed
        const id = schema.uuid
        nodes.push(createNode(schema))
        processed[id] = true
        levels[id] = level

        // add extends
        const extendedBy = schemas.filter((s) => s.extendsSchemaUuids.includes(schema.uuid))
        extendedBy.forEach((child) => {
          const childId = child.uuid
          edges.push(createExtendsEdge(childId, id))
          if (isNotProcessed(childId)) {
            processSchema(level + 1)(child)
          } else {
            pushLevelUp(childId, level + 1)
          }
        })
      }

      // identify entry nodes (those that doesn't extend anything)
      const entries = schemas.filter((schema) => schema.extendsSchemaUuids.length === 0)
      entries.forEach(processSchema(0))

      // assigning level to nodes
      nodes = nodes.map((node) => ({ ...node, level: levels[node.id] }))

      return { nodes, edges }
    },
  },
  watch: {
    $route: 'fetchData',
  },
  created() {
    this.fetchData()
  },
  methods: {
    getSchema(uuid) {
      return this.schemas.find((schema) => schema.uuid === uuid)
    },
    getVersion(uuid, versionName) {
      const schema = this.getSchema(uuid)
      const version = schema ? schema.versions.find((v) => v.version === versionName) : null
      if (version) {
        version.uuid = schema.uuid
      }
      return version
    },
    latestVersion(schema) {
      return _.last(schema.versions)
    },
    setViewDiagram(value) {
      this.viewDiagram = value
    },
    async fetchData() {
      try {
        this.status.setPending()
        const response = await api.metadataSchemas.getAll()
        this.schemas = _.orderBy(response.data, ['name'], ['asc'])
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get schemas.')
      }
    },
    async deleteMetadataSchema(schema) {
      if (schema.childSchemaUuids.length > 0) {
        window.alert('This schema cannot be deleted because other schemas extend it.')
      } else if (window.confirm(`Are you sure you want to remove ${schema.name}?`)) {
        try {
          await api.metadataSchemas.delete(schema.uuid)
          await this.fetchData()
        } catch (error) {
          this.status.setError('Unable to delete metadata schema')
        }
      }
    },
  },
})
</script>
