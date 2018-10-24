const curry = require('curry')
const lens = (getter, setter) => ({getter, setter})

const prop = key => obj => obj[key]
const path = arr => obj => {
  return arr.reduce((acc, seg) => {
    return acc && acc[seg]
  }, obj)
}

const assoc = key => value => obj => Object.assign({}, obj, {[key]: value})

const assocPath = curry(function assocPath (arr, value, obj) {
  if (Array.isArray(arr)) {
    if (arr.length === 0) {
      return obj
    } else if (arr.length === 1) {
      return assoc(arr[0])(value)(obj)
    } else {
      const [head, ...rest] = arr
      return {
        ...obj,
        [head]: assocPath(rest, value, obj[head] || {})
      }
    }
  }
})

const lensProp = key => ({getter: prop(key), setter: assoc(key)})
const lensPath = arr => ({getter: path(arr), setter: assocPath(arr)})

const view = lens => obj => lens.getter(obj)
const set = lens => value => obj => lens.setter(value)(obj)
const over = lens => fn => obj => {
  const value = view(lens)(obj)
  return set(lens)(fn(value))(obj)
}

module.exports = {
  lens,
  lensProp,
  lensPath,
  prop,
  path,
  assoc,
  assocPath,
  view,
  set,
  over
}
