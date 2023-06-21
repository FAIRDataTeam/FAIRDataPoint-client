const trueValues = [true, '1', 'true']

const falseValues = [false, '0', 'false']

function isTrue(value) {
  return trueValues.includes(value)
}

function isFalse(value) {
  return falseValues.includes(value)
}

function integerFromString(value) {
  return parseInt(value.replace(/\D/g, ''), 10) || null
}

function decimalFromString(value) {
  return parseFloat(value) || null
}

export default {
  isTrue,
  isFalse,
  integerFromString,
  decimalFromString,
}
