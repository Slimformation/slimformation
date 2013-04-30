Controller = require 'controllers/base/controller'
HomePageView = require 'views/home-page-view'
Chrome = require 'lib/chrome-interop'

module.exports = class HomeController extends Controller
  index: ->
    @view = new HomePageView region: 'main'
    Chrome.listenUpdatedTabs()
