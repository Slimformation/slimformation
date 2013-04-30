Chaplin = require 'chaplin'

module.exports = class Service

  # Mixin an Event Broker, to give Pub/Sub to this class
  _(@prototype).extend Chaplin.EventBroker

  disposed: false

  dispose: ->
    return if @disposed

    # Unbind handlers of global events
    @unsubscribeAllEvents()

    # Finished
    @disposed = true

  Object.freeze? this