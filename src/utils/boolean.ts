const trueValues = [true, '1', 'true']

const falseValues = [false, '0', 'false']

function isTrue(value) {
  return trueValues.includes(value)
}

function isFalse(value) {
  return falseValues.includes(value)
}

export default {
  isTrue,
  isFalse,
}
