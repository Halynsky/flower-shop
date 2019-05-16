export function copy(source) {
  return Object.assign({}, source)
}

export function arrayToHttpParam(array: Array<any>) {
  return array.join(',')
}
