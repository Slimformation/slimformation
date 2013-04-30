Controller = require 'controllers/base/controller'
HomePageView = require 'views/home-page-view'
ChromeService = require 'services/chrome-service'

module.exports = class HomeController extends Controller
  # hardcoded loading of services; maybe there's a better way
  @services =
    chrome-service: new ChromeService

  initialize: ->
    # publish a new event, to register a listener for the chrome event
    # whenever a tab is updated; one of the services will serve us
    @publishEvent 'listen:onUpdatedTab'

  index: ->
    @view = new HomePageView region: 'main'