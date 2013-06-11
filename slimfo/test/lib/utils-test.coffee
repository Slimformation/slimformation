utils = require 'lib/utils'

describe 'categoryReadingProportionsMap', ->
  beforeEach ->
    @catReadAmtMap =
      "politics": 0.0
      "business": 1.0
      "technology": 1.0
      "sports": 4.0
      "science": 5.0
      "entertainment": 1.0 

  it 'should return a map with keys as all categories', () ->
    map = utils.categoryReadingProportionsMap(@catReadAmtMap)
    expect(map['politics']).to.equal(Number(0.0/12.0))
    expect(map['business']).to.equal(Number(1.0/12.0))
    expect(map['technology']).to.equal(Number(1.0/12.0))
    expect(map['sports']).to.equal(Number(4.0/12.0))
    expect(map['science']).to.equal(Number(5.0/12.0))
    expect(map['entertainment']).to.equal(Number(1.0/12.0))
    
