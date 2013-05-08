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

window.require.register("application", function(exports, require, module) {
  var Application, Chaplin, routes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  routes = require('routes');

  module.exports = Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.title = 'Slimformation';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initDispatcher({
        controllerSuffix: '-controller'
      });
      this.initLayout();
      this.initComposer();
      this.initMediator();
      this.initRouter(routes);
      this.startRouting();
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initMediator = function() {
      return Chaplin.mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
});
window.require.register("config", function(exports, require, module) {
  var Config;

  Config = {
    categorizerEndpoint: "http://gentle-mesa-7611.herokuapp.com/categorize.json",
    simplifierEndpoint: "http://gentle-mesa-7611.herokuapp.com/simplify.json"
  };

  module.exports = Config;
  
});
window.require.register("controllers/base/controller", function(exports, require, module) {
  var Chaplin, Controller, HeaderView, SiteView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  SiteView = require('views/site-view');

  HeaderView = require('views/header-view');

  module.exports = Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Controller.prototype.beforeAction = {
      '.*': function() {
        this.compose('site', SiteView);
        return this.compose('header', HeaderView);
      }
    };

    return Controller;

  })(Chaplin.Controller);
  
});
window.require.register("controllers/home-controller", function(exports, require, module) {
  var CategorizerService, ChromeService, Controller, HomeController, HomePageView, ReadabilityService, ReadingScore, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HomePageView = require('views/home-page-view');

  ChromeService = require('services/chrome-service');

  CategorizerService = require('services/categorizer-service');

  ReadabilityService = require('services/readability-service');

  ReadingScore = require('lib/reading-score');

  module.exports = HomeController = (function(_super) {
    __extends(HomeController, _super);

    function HomeController() {
      _ref = HomeController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeController.services = {
      chromeService: new ChromeService,
      categorizerService: new CategorizerService,
      readabilityService: new ReadabilityService
    };

    HomeController.prototype.initialize = function() {
      this.publishEvent('listen:onUpdatedTab');
      return this.publishEvent('listen:activityPort');
    };

    HomeController.prototype.index = function() {
      return this.view = new HomePageView({
        region: 'main'
      });
    };

    return HomeController;

  })(Controller);
  
});
window.require.register("controllers/popup-controller", function(exports, require, module) {
  var Controller, GoalsView, PopupController, PopupView, PrescriptionView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  PopupView = require('views/popup-view');

  GoalsView = require('views/goals-view');

  PrescriptionView = require('views/prescription-view');

  module.exports = PopupController = (function(_super) {
    __extends(PopupController, _super);

    function PopupController() {
      _ref = PopupController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupController.prototype.initialize = function() {
      this.subscribeEvent('activity_tab', (function() {
        return this.redirectTo('#activity');
      }));
      this.subscribeEvent('goals_tab', (function() {
        return this.redirectTo('#goals');
      }));
      return this.subscribeEvent('prescription_tab', (function() {
        return this.redirectTo('#prescription');
      }));
    };

    PopupController.prototype.activity = function() {
      return this.view = new PopupView({
        region: 'main'
      });
    };

    PopupController.prototype.goals = function() {
      return this.view = new GoalsView({
        region: 'main'
      });
    };

    PopupController.prototype.prescription = function() {
      console.log('yo');
      return this.view = new PrescriptionView({
        region: 'main'
      });
    };

    return PopupController;

  })(Controller);
  
});
window.require.register("initialize", function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    return (new Application).initialize();
  });
  
});
window.require.register("lib/chrome-helpers", function(exports, require, module) {
  var ChromeHelpers;

  ChromeHelpers = {
    withActiveTabs: function(callback) {
      var queryInfo;

      queryInfo = {
        active: true,
        windowId: chrome.windows.WINDOW_ID_CURRENT
      };
      return chrome.tabs.query(queryInfo, callback);
    },
    withCompleteTabs: function(callback) {
      var queryInfo;

      queryInfo = {
        status: "complete",
        windowId: chrome.windows.WINDOW_ID_CURRENT
      };
      return chrome.tabs.query(queryInfo, callback);
    }
  };

  module.exports = ChromeHelpers;
  
});
window.require.register("lib/lexer", function(exports, require, module) {
  var Lexer, LexerNode, re;

  re = {
    url: /\b(?:(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g,
    number: /[0-9]*\.[0-9]+|[0-9]+/g,
    space: /\s+/g,
    unblank: /\S/,
    punctuation: /[\/\.\,\?\!]/g
  };

  module.exports = Lexer = (function() {
    function Lexer() {}

    Lexer.prototype.regexs = [re.url, re.number, re.space, re.punctuation];

    Lexer.prototype.lex = function(string) {
      var array, node;

      array = [];
      node = new LexerNode(string, this.regexs[0], this.regexs.slice(1));
      node.fillArray(array);
      return array;
    };

    return Lexer;

  })();

  LexerNode = (function() {
    function LexerNode(string, regex, regexs) {
      var childElements, i, nextRegex, nextRegexes;

      this.string = string;
      this.children = [];
      if (string) {
        this.matches = string.match(regex);
        childElements = string.split(regex);
      }
      if (!this.matches) {
        this.matches = [];
        childElements = [string];
      }
      if (!regexs.length) {
        this.children = childElements;
      } else {
        nextRegex = regexs[0];
        nextRegexes = regexs.slice(1);
        for (i in childElements) {
          this.children.push(new LexerNode(childElements[i], nextRegex, nextRegexes));
        }
      }
    }

    LexerNode.prototype.fillArray = function(array) {
      var child, i, match, _results;

      _results = [];
      for (i in this.children) {
        child = this.children[i];
        if (child.fillArray) {
          child.fillArray(array);
        } else {
          if (re.unblank.test(child)) {
            array.push(child);
          }
        }
        if (i < this.matches.length) {
          match = this.matches[i];
          if (re.unblank.test(match)) {
            _results.push(array.push(match));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LexerNode.prototype.toString = function() {
      var array;

      array = [];
      this.fillArray(array);
      return array.toString();
    };

    return LexerNode;

  })();
  
});
window.require.register("lib/reading-score", function(exports, require, module) {
  var Lexer, ReadingScore, text;

  Lexer = require('lib/lexer');

  ReadingScore = (function() {
    function ReadingScore(text) {
      this.words = (new Lexer).lex(text);
    }

    ReadingScore.prototype.newCount = function(word) {
      var w;

      word = word.toLowerCase();
      if (word.length <= 3) {
        return 1;
      }
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
      word = word.replace(/^y/, "");
      word = word.replace(/[0-9]+/, "");
      w = word.match(/[aeiouy]{1,2}/g);
      if (w) {
        return w.length;
      } else {
        return 0;
      }
    };

    ReadingScore.prototype.numSyllables = function() {
      var count;

      return count = _.reduce(this.words, (function(memo, word) {
        return memo + this.newCount(word);
      }), 0, this);
    };

    ReadingScore.prototype.numSentences = function() {
      return _.filter(this.words, (function(word) {
        return /[.?!]/.test(word);
      })).length;
    };

    ReadingScore.prototype.numWords = function() {
      return this.words.length - this.numSentences.length;
    };

    ReadingScore.prototype.fleschKincaid = function() {
      var numWords;

      numWords = this.numWords();
      return 206.835 - 1.015 * (numWords / this.numSentences()) - 84.6 * (this.numSyllables() / numWords);
    };

    return ReadingScore;

  })();

  text = "Once there were three tribes. The Optimists, whose patron saints were Drake and Sagan, believed in a universe crawling with gentle intelligence—spiritual brethren vaster and more enlightened than we, a great galactic siblinghood into whose ranks we would someday ascend. Surely, said the Optimists, space travel implies enlightenment, for it requires the control of great destructive energies. Any race which can't rise above its own brutal instincts will wipe itself out long before it learns to bridge the interstellar gulf.Across from the Optimists sat the Pessimists, who genuflected before graven images of Saint Fermi and a host of lesser lightweights. The Pessimists envisioned a lonely universe full of dead rocks and prokaryotic slime. The odds are just too low, they insisted. Too many rogues, too much radiation, too much eccentricity in too many orbits. It is a surpassing miracle that even one Earth exists; to hope for many is to abandon reason and embrace religious mania. After all, the universe is fourteen billion years old: if the galaxy were alive with intelligence, wouldn't it be here by now?Equidistant to the other two tribes sat the Historians. They didn't have too many thoughts on the probable prevalence of intelligent, spacefaring extraterrestrials— but if there are any, they said, they're not just going to be smart. They're going to be mean.";

  console.log(text);

  console.log((new ReadingScore(text)).fleschKincaid());

  module.exports = ReadingScore;
  
});
window.require.register("lib/support", function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
});
window.require.register("lib/utils", function(exports, require, module) {
  var Chaplin, utils;

  Chaplin = require('chaplin');

  utils = Chaplin.utils.beget(Chaplin.utils);

  _(utils).extend({
    removeProtocol: function(url) {
      return url.replace(/.*?:\/\//g, "");
    }
  });

  module.exports = utils;
  
});
window.require.register("lib/view-helper", function(exports, require, module) {
  var Chaplin,
    __slice = [].slice;

  Chaplin = require('chaplin');

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;

    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('url', function() {
    var options, params, routeName, _i;

    routeName = arguments[0], params = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
    return Chaplin.helpers.reverse(routeName, params);
  });
  
});
window.require.register("models/NewPageVisits", function(exports, require, module) {
  var Collection, NewPageVisits, PageVisit, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  PageVisit = require('models/PageVisit');

  module.exports = NewPageVisits = (function(_super) {
    __extends(NewPageVisits, _super);

    function NewPageVisits() {
      _ref = NewPageVisits.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewPageVisits.prototype.model = PageVisit;

    NewPageVisits.prototype.localStorage = new Backbone.LocalStorage("NewPageVisits");

    return NewPageVisits;

  })(Collection);
  
});
window.require.register("models/PageVisit", function(exports, require, module) {
  var Config, Model, PageVisit, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require('lib/utils');

  Config = require('config');

  Model = require('models/base/model');

  module.exports = PageVisit = (function(_super) {
    __extends(PageVisit, _super);

    function PageVisit() {
      _ref = PageVisit.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PageVisit.prototype.created_at = null;

    PageVisit.prototype.updated_at = null;

    PageVisit.prototype.url = null;

    PageVisit.prototype.category = null;

    PageVisit.prototype.title = null;

    PageVisit.prototype.content = null;

    PageVisit.prototype.wordCount = null;

    PageVisit.prototype.readingScore = null;

    PageVisit.prototype.defaults = {
      created_at: (new Date()).getTime(),
      updated_at: (new Date()).getTime(),
      category: "Other"
    };

    PageVisit.prototype.validate = function(attrs, options) {
      var isChromeUrl;

      isChromeUrl = /^chrome/i.test(attrs.url);
      if (isChromeUrl) {
        return "Not a valid URL.";
      }
    };

    return PageVisit;

  })(Model);
  
});
window.require.register("models/base/collection", function(exports, require, module) {
  var Chaplin, Collection, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Model = require('models/base/model');

  module.exports = Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      _ref = Collection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Collection.prototype.model = Model;

    return Collection;

  })(Chaplin.Collection);
  
});
window.require.register("models/base/model", function(exports, require, module) {
  var Chaplin, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      _ref = Model.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Model;

  })(Chaplin.Model);
  
});
window.require.register("routes", function(exports, require, module) {
  module.exports = function(match) {
    match('public', 'home#index');
    match('public/index.html', 'home#index');
    match('public/background.html', 'home#index');
    match('public/popup.html', 'popup#activity');
    match('#activity', 'popup#activity');
    match('#goals', 'popup#goals');
    return match('#prescription', 'popup#prescription');
  };
  
});
window.require.register("services/base/service", function(exports, require, module) {
  var Chaplin, Service;

  Chaplin = require('chaplin');

  module.exports = Service = (function() {
    function Service() {}

    _(Service.prototype).extend(Chaplin.EventBroker);

    Service.prototype.disposed = false;

    Service.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.unsubscribeAllEvents();
      return this.disposed = true;
    };

    if (typeof Object.freeze === "function") {
      Object.freeze(Service);
    }

    return Service;

  })();
  
});
window.require.register("services/categorizer-service", function(exports, require, module) {
  var CategorizerService, Config, Service, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require('lib/utils');

  Config = require('config');

  Service = require('services/base/service');

  module.exports = CategorizerService = (function(_super) {
    __extends(CategorizerService, _super);

    function CategorizerService() {
      CategorizerService.__super__.constructor.apply(this, arguments);
      this.subscribeEvent('add:PageVisit', this.categorize);
    }

    CategorizerService.prototype.categorize = function(pageVisit) {
      var pageUrl;

      pageUrl = pageVisit.attributes.url;
      if (pageUrl === null) {
        return;
      }
      console.log("trying to categorize " + pageUrl);
      return $.ajax({
        url: Config.categorizerEndpoint + ("?url=" + pageUrl)
      }).done(function(data) {
        return pageVisit.save({
          category: data.category
        });
      }).fail(function(data) {
        console.log("Ajax request failed");
        return console.log(data);
      });
    };

    return CategorizerService;

  })(Service);
  
});
window.require.register("services/chrome-service", function(exports, require, module) {
  var Chaplin, ChromeService, NewPageVisits, PageVisit, Service,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Service = require('services/base/service');

  PageVisit = require('models/PageVisit');

  NewPageVisits = require('models/NewPageVisits');

  module.exports = ChromeService = (function(_super) {
    __extends(ChromeService, _super);

    function ChromeService() {
      ChromeService.__super__.constructor.apply(this, arguments);
      this.subscribeEvent('listen:onUpdatedTab', this.onUpdatedTab);
      this.subscribeEvent('listen:activityPort', this.updateActvity);
    }

    ChromeService.prototype.onUpdatedTab = function() {
      return chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        var npv, pv;

        if ((changeInfo.url === void 0) || (/^chrome/i.test(changeInfo.url))) {
          return;
        }
        console.log("Tab Update: the url of tab " + tabId + " changed to " + changeInfo.url);
        npv = new NewPageVisits;
        pv = npv.create({
          url: changeInfo.url
        });
        return Chaplin.mediator.publish('add:PageVisit', pv);
      });
    };

    ChromeService.prototype.updateActvity = function() {
      var npv;

      npv = new NewPageVisits;
      return chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name === "activity");
        port.postMessage({
          type: "initialize"
        });
        return port.onMessage.addListener(function(msg) {
          console.log("Activity Update: " + JSON.stringify(msg));
          switch (msg.type) {
            case "update":
              return $.when(npv.fetch()).then(function() {
                return npv.findWhere({
                  url: msg.pageVisitUrl
                });
              }).then(function(pv) {
                return pv.save({
                  updated_at: msg.timestamp
                });
              });
          }
        });
      });
    };

    return ChromeService;

  })(Service);
  
});
window.require.register("services/readability-service", function(exports, require, module) {
  var Config, ReadabilityService, ReadingScore, Service,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ReadingScore = require('lib/reading-score');

  Config = require('config');

  Service = require('services/base/service');

  module.exports = ReadabilityService = (function(_super) {
    __extends(ReadabilityService, _super);

    function ReadabilityService() {
      ReadabilityService.__super__.constructor.apply(this, arguments);
      this.subscribeEvent('add:PageVisit', this.simplify);
    }

    ReadabilityService.prototype.simplify = function(pageVisit) {
      var pageUrl;

      pageUrl = pageVisit.attributes.url;
      if (pageUrl === null) {
        return;
      }
      console.log("trying to simplify " + pageUrl);
      return $.ajax({
        url: Config.simplifierEndpoint + ("?url=" + pageUrl)
      }).done(function(data) {
        return pageVisit.save({
          title: data.title,
          content: data.content,
          wordCount: data.word_count,
          readingScore: (new ReadingScore($(data.content).text())).fleschKincaid()
        }).then(function(pv) {
          return console.log(pv);
        });
      }).fail(function(data) {
        console.log("Ajax request failed");
        return console.log(data);
      });
    };

    return ReadabilityService;

  })(Service);
  
});
window.require.register("views/base/collection-view", function(exports, require, module) {
  var Chaplin, CollectionView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      _ref = CollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
});
window.require.register("views/base/view", function(exports, require, module) {
  var Chaplin, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view-helper');

  module.exports = View = (function(_super) {
    __extends(View, _super);

    function View() {
      _ref = View.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
});
window.require.register("views/goals-view", function(exports, require, module) {
  var GoalsView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/goals');

  module.exports = GoalsView = (function(_super) {
    __extends(GoalsView, _super);

    function GoalsView() {
      _ref = GoalsView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GoalsView.prototype.className = 'goals';

    GoalsView.prototype.autoRender = true;

    GoalsView.prototype.template = template;

    return GoalsView;

  })(View);
  
});
window.require.register("views/header-view", function(exports, require, module) {
  var Chaplin, HeaderView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  Chaplin = require('chaplin');

  template = require('views/templates/header');

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.className = 'header';

    HeaderView.prototype.region = 'header';

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.template = template;

    HeaderView.prototype.initialize = function() {
      HeaderView.__super__.initialize.apply(this, arguments);
      this.delegate('click', '.activity', this.renderActivityTab);
      this.delegate('click', '.goals', this.renderGoalsTab);
      return this.delegate('click', '.prescription', this.renderPrescriptionTab);
    };

    HeaderView.prototype.renderActivityTab = function() {
      return Chaplin.mediator.publish('activity_tab');
    };

    HeaderView.prototype.renderGoalsTab = function() {
      return Chaplin.mediator.publish('goals_tab');
    };

    HeaderView.prototype.renderPrescriptionTab = function() {
      return Chaplin.mediator.publish('prescription_tab');
    };

    return HeaderView;

  })(View);
  
});
window.require.register("views/home-page-view", function(exports, require, module) {
  var HomePageView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  View = require('views/base/view');

  module.exports = HomePageView = (function(_super) {
    __extends(HomePageView, _super);

    function HomePageView() {
      _ref = HomePageView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomePageView.prototype.autoRender = true;

    HomePageView.prototype.className = 'home-page';

    HomePageView.prototype.template = template;

    return HomePageView;

  })(View);
  
});
window.require.register("views/popup-view", function(exports, require, module) {
  var PopupView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/popup');

  module.exports = PopupView = (function(_super) {
    __extends(PopupView, _super);

    function PopupView() {
      _ref = PopupView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupView.prototype.className = 'popup';

    PopupView.prototype.autoRender = true;

    PopupView.prototype.template = template;

    return PopupView;

  })(View);
  
});
window.require.register("views/prescription-view", function(exports, require, module) {
  var PrescriptionView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/prescription');

  module.exports = PrescriptionView = (function(_super) {
    __extends(PrescriptionView, _super);

    function PrescriptionView() {
      _ref = PrescriptionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PrescriptionView.prototype.className = 'prescription';

    PrescriptionView.prototype.autoRender = true;

    PrescriptionView.prototype.template = template;

    PrescriptionView.prototype.initialize = function() {
      PrescriptionView.__super__.initialize.apply(this, arguments);
      return console.log('ugh');
    };

    return PrescriptionView;

  })(View);
  
});
window.require.register("views/site-view", function(exports, require, module) {
  var SiteView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/site');

  module.exports = SiteView = (function(_super) {
    __extends(SiteView, _super);

    function SiteView() {
      _ref = SiteView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SiteView.prototype.container = 'body';

    SiteView.prototype.id = 'site-container';

    SiteView.prototype.regions = {
      '#header-container': 'header',
      '#page-container': 'main'
    };

    SiteView.prototype.template = template;

    return SiteView;

  })(View);
  
});
window.require.register("views/templates/goals", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<h1>GOALS</h1>\n";
    });
});
window.require.register("views/templates/header", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"navbar\">\n  <div class=\"navbar-inner\">\n    <a class=\"brand\"></a>\n    <ul class=\"nav\">\n      <li class=\"activity selected\"><a href=\"#\">Activity</a></li>\n      <li class=\"goals\"><a href=\"#\">Goals</a></li>\n      <li class=\"prescription\"><a href=\"#\">Prescription</a></li>\n    </ul>\n  </div>\n</div>\n";
    });
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<a href=\"http://brunch.io/\">\n  <img src=\"http://brunch.io/images/brunch.png\" alt=\"Brunch\" />\n</a>\n";
    });
});
window.require.register("views/templates/popup", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<h1>This is a Popup!</h1>";
    });
});
window.require.register("views/templates/prescription", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<h1>PRESCRIPTION</h1>\n";
    });
});
window.require.register("views/templates/site", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<header id=\"header-container\" class=\"header-container\"></header>\n\n<div class=\"container outer-container\">\n  <div id=\"page-container\" class=\"container\" >\n  </div>\n</div>\n";
    });
});
