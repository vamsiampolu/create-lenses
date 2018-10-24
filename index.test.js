const assert = require('assert').strict
const {
  prop,
  path,
  assoc,
  assocPath,
  lens,
  lensProp,
  lensPath,
  view,
  set,
  over
} = require('./index')

function camelize (str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    })
    .replace(/\s+/g, '')
}

assert.equal(camelize('is nested'), 'isNested')
assert.equal(camelize('is not nested'), 'isNotNested')

const TestRunner = require('test-runner')
const runner = new TestRunner()

function testProp () {
  const objA = {
    name: 'A'
  }
  const nameProp = prop('name')
  assert.equal(
    nameProp(objA),
    objA.name,
    'Prop Does not retrieve correct value'
  )
}

function testPath () {
  const objA = {
    name: {
      and: {
        address: 'unknown'
      }
    }
  }

  const objB = {
    'is this': {
      the: {
        'real life': 'or is this just fantasy'
      }
    }
  }

  assert.equal(path(['name', 'and', 'address'])(objA), objA.name.and.address)
  assert.equal(
    path(['is this', 'the', 'real life'])(objB),
    objB['is this'].the['real life']
  )
}

function testAssoc () {
  const objA = {name: 'objA'}
  const objB = {bee: 'bubble'}

  const setName = assoc('name')
  const setBee = assoc('bee')

  assert.deepEqual(setName('newObjA')(objA), {
    name: 'newObjA'
  })

  assert.deepEqual(setBee('bumble')(objB), {
    bee: 'bumble'
  })
}

function testAssocPath () {
  const objA = {
    name: {
      and: {
        address: 'unknown'
      }
    }
  }

  assert.equal(assocPath([], 'what?', objA), objA)
  assert.deepEqual(assocPath(['name'], 'syco', {name: 'P'}), {name: 'syco'})
  assert.deepEqual(
    assocPath(['actual', 'first', 'name'], 'silver', {
      actual: {
        first: {name: 'surfer', nickName: 'ag'},
        middle: 'Middle'
      }
    }),
    {actual: {first: {name: 'silver', nickName: 'ag'}, middle: 'Middle'}}
  )
  assert.deepEqual(
    assocPath(['actual', 'first', 'name'])('silver')({
      actual: {
        first: {name: 'surfer', nickName: 'ag'},
        middle: 'Middle'
      }
    }),
    {actual: {first: {name: 'silver', nickName: 'ag'}, middle: 'Middle'}}
  )
}

function testView () {
  const issueLens = lens(prop('issue'), assoc('issue'))
  const issueLensProp = lensProp('issue')
  const nameLens = lensPath(['issue', 'name'])
  const fixture = {
    issue: {
      name: 'nested'
    }
  }

  const fixture2 = {
    issue: {
      name: 'nested2'
    }
  }

  assert.deepEqual(view(issueLens)(fixture), {name: 'nested'})
  assert.deepEqual(view(issueLensProp)(fixture2), {name: 'nested2'})
  assert.equal(view(nameLens)(fixture), 'nested')
  assert.equal(view(nameLens)(fixture2), 'nested2')
}

function testSet () {
  const issueLens = lens(prop('issue'), assoc('issue'))
  const issueLensProp = lensProp('issue')
  const nameLens = lensPath(['issue', 'name'])
  const fixture = {
    issue: {
      name: 'nested'
    }
  }

  const fixture2 = {
    issue: {
      name: 'nested2'
    }
  }

  assert.deepEqual(set(issueLens)({name: 'is_nested'})(fixture), {
    issue: {name: 'is_nested'}
  })
  assert.deepEqual(set(issueLensProp)({name: 'is_not_nested'})(fixture2), {
    issue: {
      name: 'is_not_nested'
    }
  })

  assert.deepEqual(set(nameLens)('is_nested')(fixture), {
    issue: {name: 'is_nested'}
  })
  assert.deepEqual(set(nameLens)('is_not_nested')(fixture2), {
    issue: {
      name: 'is_not_nested'
    }
  })
}

function testOver () {
  const issueLens = lens(prop('issue'), assoc('issue'))
  const nameLens = lensPath(['issue', 'name'])
  const issueLensProp = lensProp('issue')

  const fixture = {
    issue: {
      name: 'is nested'
    }
  }

  const fixture2 = {
    issue: {
      name: 'is not nested2'
    }
  }

  const fn = obj => ({...obj, name: camelize(obj.name)})

  assert.deepEqual(over(issueLens)(fn)(fixture), {
    issue: {name: 'isNested'}
  })
  assert.deepEqual(over(issueLensProp)(fn)(fixture2), {
    issue: {
      name: 'isNotNested2'
    }
  })

  assert.deepEqual(over(nameLens)(camelize)(fixture), {
    issue: {name: 'isNested'}
  })
  assert.deepEqual(over(nameLens)(camelize)(fixture2), {
    issue: {
      name: 'isNotNested2'
    }
  })
}

runner.test('prop', testProp)
runner.test('path', testPath)
runner.test('assoc', testAssoc)
runner.test('assocPath', testAssocPath)
runner.test('view', testView)
runner.test('set', testSet)
runner.test('over', testOver)
