export type BreadcrumbItem = {
  label: string,
  to: string
}

function createItem(label: string, to: string): BreadcrumbItem {
  return { label, to }
}

export default {
  createItem,
}
