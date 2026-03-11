export const truncate = (str: string): string => (str.length <= 180
  ? str
  : `${str.substr(0, 180).trim()}...`)
