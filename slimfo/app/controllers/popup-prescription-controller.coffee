PopupSiteController = require 'controllers/popup-site-controller'
PopupPrescriptionView = require 'views/popup/prescription-view'
PrescriptionListView = require 'views/collections/prescription-list-view'
NewPageVisits = require 'models/NewPageVisits'

module.exports = class PopupPrescriptionController extends PopupSiteController
  show: ->
    @view = new PopupPrescriptionView region: 'popup-main'
    npv = new NewPageVisits
    npv.fetch()

    #console.log $('.btn.btn-primary.active').attr('id')
    categ = $('.btn.btn-primary.active').attr('id')

    prescriptionListView = new PrescriptionListView(collection: npv, autoRender: true, container: @el, region: 'prescription-list')
    prescriptionListView.diversityAndReadingLevelCheckup(categ)