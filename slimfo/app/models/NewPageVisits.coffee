Collection = require 'models/base/collection'
PageVisit = require 'models/PageVisit'

module.exports = class NewPageVisits extends Collection
  model: PageVisit

  localStorage: new Backbone.LocalStorage("NewPageVisits")
