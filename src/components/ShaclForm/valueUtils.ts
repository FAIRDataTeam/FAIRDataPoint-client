const trueValues = [true, '1', 'true']

const falseValues = [false, '0', 'false']

function isTrue(value: unknown) {
  if (typeof value === 'string' || typeof value === 'boolean') {
    return trueValues.includes(value)
  }
  return false
}

function isFalse(value: unknown) {
  if (typeof value === 'string' || typeof value === 'boolean') {
    return falseValues.includes(value)
  }
  return false
}

function integerFromString(value: string) {
  return parseInt(value.replace(/\D/g, ''), 10) || null
}

function decimalFromString(value: string) {
  return parseFloat(value) || null
}

export default {
  isTrue,
  isFalse,
  integerFromString,
  decimalFromString,
}
