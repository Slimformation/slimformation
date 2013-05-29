View = require 'views/base/collection-view'
CollectionView = require 'views/base/collection-view'
template = require 'views/templates/collections/new-page-visits'
PageVisitView = require 'views/models/page-visit-view'

module.exports = class NewPageVisitsView extends CollectionView
  # el: '#popup-main-container'
  autoRender: true
  autoAttach: true
  template: template
  itemView: PageVisitView
  listSelector: '#new-page-visits-list'
