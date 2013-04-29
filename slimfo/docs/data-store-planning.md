# Planning out data storage

## Storage

- [Breeze](http://www.breezejs.com)
  - with [Lawnchair](http://brian.io/lawnchair/), perhaps

## Stack

- AngularJS + BreezeJS + Lawnchair. Angular will be how we power the views and logic, Breeze will provide us with a nice way to manage data, and Lawnchair will be provide an easy way to persistent Breeze's data locally.
- Chaplin + whatever the hell else is needed for storage
  - this is the one we're going with

## Research

- Use one of the many offline APIs that Chrome provides
- Ask for permission for unlimited storage in the manifest file. Learn more [here](https://developers.google.com/chrome/whitepapers/storage).
- There's a high level wrapper for IndexedDB called [DB.js](http://aaronpowell.github.io/db.js/).
- There's a library [very alpha] that is essentially couchdb in javascript called [pouchdb](http://pouchdb.com/)
- There's a sweet data library called [BreezeJS](http://www.breezejs.com) with the ability to export a string for [local or remote storage](http://www.breezejs.com/documentation/exportimport). We could export a string and store it in localStorage.
- [AngularJS](http://angularjs.org/) seems to take care of DOM manipulation and dynamic binding for you. Also, I have some previous experience.
- [Lawnchair](http://brian.io/lawnchair/) is a brilliant little abstraction of persistence for client-side stuff, and is also mobile friendly (re: efficient).
- [Chaplin](http://chaplinjs.org) is the default with Brunch; it's Backbone in CoffeeScript, with a lot of niceties.



