Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/popup/welcome'
utils = require 'lib/utils'

module.exports = class WelcomeView extends View
  #el: $('#welcome-container')
  autoRender: true
  autoAttach: true
  template: template
  className: 'welcome-view'

  # getTemplateData: ->
  #   {@name, @cid, timestamp: Date.now(), @region}
