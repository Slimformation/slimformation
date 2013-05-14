Controller = require 'controllers/base/controller'
PopupSiteView = require 'views/popup/site-view'
PopupHeaderView = require 'views/popup/header-view'
PopupFooterView = require 'views/popup/footer-view'
# ActivityView = require 'views/activity-view'

# PopupView = require 'views/popup-view'
# GoalsView = require 'views/goals-view'
# PrescriptionView = require 'views/prescription-view'

module.exports = class PopupSiteController extends Controller
  # compose the views
  beforeAction:
    '.*': ->
      @compose 'popup-site', PopupSiteView
      @compose 'popup-header', PopupHeaderView, region: 'popup-header'
      @compose 'popup-footer', PopupFooterView, region: 'popup-footer'

  initialize: ->
    super
    @subscribeEvent 'activity_tab', (-> @redirectTo '#activity')
    @subscribeEvent 'goals_tab', (-> @redirectTo '#goals')
    @subscribeEvent 'prescription_tab', (-> @redirectTo '#prescription')

  # activity: ->
  #   @view = new ActivityView region: 'popup-main'

  # goals: ->
  #   @view = new GoalsView region: 'main'

  # prescription: ->
  #   console.log 'yo'
  #   @view = new PrescriptionView region: 'main'
