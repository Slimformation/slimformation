PopupSiteController = require 'controllers/popup-site-controller'
PopupPrescriptionView = require 'views/popup/prescription-view'

module.exports = class PopupPrescriptionController extends PopupSiteController

  show: ->
    @view = new PopupPrescriptionView region: 'popup-main'