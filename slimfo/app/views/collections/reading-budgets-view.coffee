CollectionView = require 'views/base/collection-view'
template = require 'views/templates/collections/reading-budgets'
ReadingBudgetView = require 'views/models/reading-budget-view'
Chaplin = require 'chaplin'
ReadingBudgets = require 'models/ReadingBudgets'

module.exports = class ReadingBudgetsView extends CollectionView
  autoRender: true
  autoAttach: true
  template: template
  itemView: ReadingBudgetView
  listSelector: '#reading-budgets'

