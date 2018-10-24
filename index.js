const curry = require('curry')
const lens = (getter, setter) => ({getter, setter})

const prop = curry(function prop (key, obj) {
  return obj[key]
})

const path = curry(function path (arr, obj) {
  return arr.reduce((acc, seg) => {
    return acc && acc[seg]
  }, obj)
})

const assoc = curry(function assoc (key, value, obj) {
  return Object.assign({}, obj, {[key]: value})
})

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

const view = curry(function view (lens, obj) {
  return lens.getter(obj)
})

const set = curry(function (lens, value, obj) {
  return lens.setter(value)(obj)
})

const over = curry(function over (lens, fn, obj) {
  const value = view(lens)(obj)
  return set(lens)(fn(value))(obj)
})

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
