Collection = require 'models/base/collection'
NewPageVisits = require 'models/NewPageVisits'
NewPageVisits = require 'models/NewPageVisits'

describe 'NewPageVisits', ->
  beforeEach ->
    @model = new NewPageVisits()
    @collection = new NewPageVisits()

  afterEach ->
    @model.dispose()
    @collection.dispose()
