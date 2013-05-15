(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("test/controllers/popup-activity-controller-test", function(exports, require, module) {
  var PopupActivity;

  PopupActivity = require('controllers/popup-activity-controller');

  describe('PopupActivity', function() {
    return beforeEach(function() {
      return this.controller = new PopupActivity();
    });
  });
  
});
window.require.register("test/controllers/popup-goals-controller-test", function(exports, require, module) {
  var PopupGoals;

  PopupGoals = require('controllers/popup-goals-controller');

  describe('PopupGoals', function() {
    return beforeEach(function() {
      return this.controller = new PopupGoals();
    });
  });
  
});
window.require.register("test/controllers/popup-prescription-controller-test", function(exports, require, module) {
  var PopupPrescription;

  PopupPrescription = require('controllers/popup-prescription-controller');

  describe('PopupPrescription', function() {
    return beforeEach(function() {
      return this.controller = new PopupPrescription();
    });
  });
  
});
window.require.register("test/initialize", function(exports, require, module) {
  var test, tests, _i, _len;

  tests = ['./views/header-view-test', './views/home-page-view-test', './views/site-view-test'];

  for (_i = 0, _len = tests.length; _i < _len; _i++) {
    test = tests[_i];
    require(test);
  }
  
});
window.require.register("test/models/Category-test", function(exports, require, module) {
  var Category;

  Category = require('models/Category');

  describe('Category', function() {
    return beforeEach(function() {
      return this.model = new Category();
    });
  });
  
});
window.require.register("test/models/NewPageVisits-test", function(exports, require, module) {
  var Collection, NewPageVisits;

  Collection = require('models/base/collection');

  NewPageVisits = require('models/NewPageVisits');

  NewPageVisits = require('models/NewPageVisits');

  describe('NewPageVisits', function() {
    beforeEach(function() {
      this.model = new NewPageVisits();
      return this.collection = new NewPageVisits();
    });
    return afterEach(function() {
      this.model.dispose();
      return this.collection.dispose();
    });
  });
  
});
window.require.register("test/models/PageVisit-test", function(exports, require, module) {
  var PageVisit;

  PageVisit = require('models/PageVisit');

  describe('PageVisit', function() {
    return beforeEach(function() {
      return this.model = new PageVisit();
    });
  });
  
});
window.require.register("test/views/background-index-view-test", function(exports, require, module) {
  var BackgroundIndexView;

  BackgroundIndexView = require('views/background-index-view');

  describe('BackgroundIndexView', function() {
    return beforeEach(function() {
      return this.view = new BackgroundIndexView();
    });
  });
  
});
window.require.register("test/views/home-page-view-test", function(exports, require, module) {
  var HomePageView;

  HomePageView = require('views/home-page-view');

  describe('HomePageView', function() {
    return beforeEach(function() {
      return this.view = new HomePageView();
    });
  });
  
});
