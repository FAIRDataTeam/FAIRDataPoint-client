export default function trim(str) {
  if (str.length <= 180) {
    return str
  }

  return `${str.substr(0, 180).trim()}...`
}
