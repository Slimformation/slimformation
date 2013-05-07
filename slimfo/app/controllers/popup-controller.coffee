Controller = require 'controllers/base/controller'
PopupView = require 'views/popup-view'
GoalsView = require 'views/goals-view'
PrescriptionView = require 'views/prescription-view'

module.exports = class PopupController extends Controller
  initialize: ->
    @subscribeEvent 'activity_tab', (-> @redirectTo '#activity')
    @subscribeEvent 'goals_tab', (-> @redirectTo '#goals')
    @subscribeEvent 'prescription_tab', (-> @redirectTo '#prescription')

  activity: ->
    @view = new PopupView region: 'main'

  goals: ->
    @view = new GoalsView region: 'main'

  prescription: ->
    console.log 'yo'
    @view = new PrescriptionView region: 'main'
