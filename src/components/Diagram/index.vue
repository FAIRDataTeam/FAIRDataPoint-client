<template>
  <div />
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Network } from 'vis-network'

export default defineComponent({
  props: {
    modelData: { type: Object as PropType<any>, required: true },
  },
  data() {
    return {
      diagram: null,
    }
  },
  watch: {
    modelData: 'onModelDataChanged',
  },
  mounted() {
    this.drawDiagram()
  },
  methods: {
    onModelDataChanged() {
      this.drawDiagram()
    },
    drawDiagram() {
      const container = this.$el as HTMLElement
      const data = {
        nodes: this.modelData.nodes,
        edges: this.modelData.edges,
      }
      const options = {
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'UD',
            levelSeparation: 120,
          },
        },
        physics: {
          hierarchicalRepulsion: {
            avoidOverlap: 0.1,
            springLength: 220,
          },
        },
        nodes: {
          borderWidth: 2,
          borderWidthSelected: 3,
          margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          font: {
            size: 16,
            multi: true,
          },
          widthConstraint: {
            minimum: 100,
          },
        },
      }
      this.diagram = new Network(container, data, options)
    },
  },
})
</script>
