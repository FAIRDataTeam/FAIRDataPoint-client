export function stateClass(state: string) {
  switch (state) {
    case 'ALL':
      return 'primary'
    case 'ACTIVE':
      return 'success'
    case 'INACTIVE':
      return 'dark'
    case 'UNREACHABLE':
      return 'warning'
    case 'INVALID':
      return 'danger'
    case 'UNKNOWN':
      return 'info'
    default:
      return ''
  }
}
