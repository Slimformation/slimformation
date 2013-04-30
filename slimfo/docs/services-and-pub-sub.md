# Services and Pub/Sub

## Background Info

**Chrome's Extension API**

- lots of events to bind and pass callbacks to
- example: chrome.tabs.query, which you can configure to ask for the current active tab and give it a callback to do things with that information

**Chaplin's Mediator and Pub/Sub**

- Check out [Mediator](https://github.com/chaplinjs/chaplin/blob/master/docs/chaplin.mediator.md) and the related [EventBroker](https://github.com/chaplinjs/chaplin/blob/master/docs/chaplin.event_broker.md)
  - go ahead and look at the source too, it's not too complex
- So, Chaplin.Mediator basically allows us to do event-driven programming.
- ...opportunity to glue Chaplin and chrome stuff together nicely.

## Proposal

- Let's make services (classes that mixin Chaplin.EventBroker) that subscribe to certain events and then do them
- Let's start those services in the controller's initialize() function (so they can start listening)
- Let's then publish events in that controller or elsewhere (making sure the service is running, of course)
- Then, we'll have a good way to integrate all this into Chaplin!
- You could even keep services running by instantiating them in `application.coffee`. 
- But, it makes sense to at least be able to dispose them as needed.

## Implementation

- The commit this file was introduced has an example: `services/chrome-service` and corresponding publishing of an event in `controllers/home-controller`


