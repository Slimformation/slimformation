View = require 'views/base/view'
template = require 'views/templates/popup-site'

# Site view is a top-level view which is bound to body.
module.exports = class PopupSiteView extends View
  container: 'body'
  id: 'popup-site-container'
  regions:
    '#popup-header-container': 'popup-header'
    '#popup-main-container': 'popup-main'
    '#popup-footer-container': 'popup-footer'
  template: template
