# Slimformation - Chrome Extension

## Overview

`app` has subfolders that we're calling 'widgets'. they're just simple HTML and related assets, bunched together because they relate to each other. 

You can create other such widgets by running `rake create_widget['foo']`.

`manifest.json` is this Chrome extension's main file.

`icons` has images needed by this Chrome extension.

## Development

### Requirements

node and npm

- `brew install node`, or go [here](http://nodejs.org/download/).
  - Installs `node` and `npm`

ruby 1.9.3 and bundler

- Totally new? [Rails Installer](http://railsinstaller.org/)
- [RVM](http://rvm.io)
- [Bundler](http://rubygems.org/gems/bundler)

### Build

You don't need to build, per se, but you need to build your dev environment. Also, without third party components downloaded, things probably won't work.

So, just do `./build.sh`.


### Managing Components

- `component.json`
- Run `bower install` after adding components to `component.json`.

### Managing Dependencies (JavaScript)

- `package.json`
- `npm install`

### Managing Dependencies (Ruby)

- `Gemfile`
- `bundle install`

### Watch CoffeeScript & Compile

`guard`



### RequireJS Usage
- An [example setup](http://requirejs.org/docs/start.html).
- Basically, use `components/requirejs/require.js` and load like normal. To include third party components, make sure you set either `data-root` in HTML or `baseUrl` in JavaScript to be the root of the entire app ('./').
- See `app/mockup/mockup.html` for an example setup.


