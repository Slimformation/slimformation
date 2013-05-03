Controller = require 'controllers/base/controller'
HomePageView = require 'views/home-page-view'
ChromeService = require 'services/chrome-service'
CategorizerService = require 'services/categorizer-service'

module.exports = class HomeController extends Controller
  # hardcoded loading of services; maybe there's a better way
  @services =
    chromeService: new ChromeService
    categorizerService: new CategorizerService

  initialize: ->
    # publish a new event, to register a listener for the chrome event
    # whenever a tab is updated; one of the services will serve us
    @publishEvent 'listen:onUpdatedTab'

  index: ->
    @view = new HomePageView region: 'main'