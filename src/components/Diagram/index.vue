<template>
  <div />
</template>
<script lang="ts">
import { Network } from 'vis-network'
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'

@Component({})
export default class Diagram extends Vue {
  @Prop({ required: true })
    modelData: any

  diagram: any = null

  mounted() {
    this.drawDiagram()
  }

  @Watch('modelData')
  onModelDataChanged() {
    this.drawDiagram()
  }

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
    const network = new Network(container, data, options)
  }
}
</script>
