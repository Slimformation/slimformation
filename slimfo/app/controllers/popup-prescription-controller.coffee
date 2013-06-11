PopupSiteController = require 'controllers/popup-site-controller'
PopupPrescriptionView = require 'views/popup/prescription-view'
PrescriptionListView = require 'views/collections/prescription-list-view'
NewPageVisits = require 'models/NewPageVisits'
ReadingBudgets = require 'models/ReadingBudgets'
Chaplin = require 'chaplin'

module.exports = class PopupPrescriptionController extends PopupSiteController
  show: ->
    @view = new PopupPrescriptionView region: 'popup-main'
    @newPrescriptionTab('politics')

  initialize: ->
  	super
  	Chaplin.mediator.subscribe 'new_prescription_tab', @newPrescriptionTab

  newPrescriptionTab: (categ) ->
    $('#prescription-list').empty()
    npv = new NewPageVisits
    npv.fetch()

    rb = new ReadingBudgets
    rb.fetch()

    #console.log $('.btn.btn-primary.active').attr('id')
    #categ = $('.btn.btn-primary.active').attr('id')

    prescriptionListViewGoals = new PrescriptionListView(collection: rb, autoRender: true, container: @el, region: 'prescription-list')
    prescriptionListViewGoals.goalsCheckup(categ)

    prescriptionListView = new PrescriptionListView(collection: npv, autoRender: true, container: @el, region: 'prescription-list')
    prescriptionListView.diversityAndReadingLevelCheckup(categ)

