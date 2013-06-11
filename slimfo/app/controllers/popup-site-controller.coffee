Controller = require 'controllers/base/controller'
PopupSiteView = require 'views/popup/site-view'
PopupHeaderView = require 'views/popup/header-view'
PopupFooterView = require 'views/popup/footer-view'

module.exports = class PopupSiteController extends Controller
  # compose the views
  beforeAction:
    '.*': ->
      @compose 'popup-site', PopupSiteView
      @compose 'popup-header', PopupHeaderView, region: 'popup-header'
      @compose 'popup-footer', PopupFooterView, region: 'popup-footer'

  initialize: ->
    super
    # tab click events
    @subscribeEvent 'activity_tab', (-> @redirectTo '#activity')
    @subscribeEvent 'goals_tab', (-> @redirectTo '#goals')
    @subscribeEvent 'prescription_tab', (-> @redirectTo '#prescription')
    # handle events for view display
    @subscribeEvent 'display:NewPageVisits', (-> @redirectTo '#NewPageVisits')

