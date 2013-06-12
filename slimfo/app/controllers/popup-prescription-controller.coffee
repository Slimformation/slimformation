PopupSiteController = require 'controllers/popup-site-controller'
PopupPrescriptionView = require 'views/popup/prescription-view'
PrescriptionListView = require 'views/collections/prescription-list-view'
NewPageVisits = require 'models/NewPageVisits'
ReadingBudgets = require 'models/ReadingBudgets'
Chaplin = require 'chaplin'

module.exports = class PopupPrescriptionController extends PopupSiteController
  show: ->
    @view = new PopupPrescriptionView region: 'popup-main'
    businessCheckup=@newPrescriptionTab('business')
    technologyCheckup=@newPrescriptionTab('technology')
    sportsCheckup=@newPrescriptionTab('sports')
    scienceCheckup=@newPrescriptionTab('science')
    entertainmentCheckup=@newPrescriptionTab('entertainment')
    politicsCheckup=@newPrescriptionTab('politics')
    overallHealth = politicsCheckup+businessCheckup+technologyCheckup+sportsCheckup+scienceCheckup+entertainmentCheckup
    $('#greeting').append('You are meeting <b class="prescription-special">' + ((overallHealth/18)*100).toFixed(1) + '%</b> of your total goals.</br>Please select the category you would like a diagnosis on:')

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
    goalsMet=prescriptionListViewGoals.goalsCheckup(categ)

    prescriptionListView = new PrescriptionListView(collection: npv, autoRender: true, container: @el, region: 'prescription-list')
    isDiverseAndGoodReadingLevel=prescriptionListView.diversityAndReadingLevelCheckup(categ)

    overallCheckup = goalsMet + isDiverseAndGoodReadingLevel
    return overallCheckup
