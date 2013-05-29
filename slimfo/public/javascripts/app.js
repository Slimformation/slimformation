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
    simplifierEndpoint: "http://gentle-mesa-7611.herokuapp.com/simplify.json",
    newscatEndpoint: "http://calm-thicket-4369.herokuapp.com/categorize.json"
  };

  module.exports = Config;
  
});
window.require.register("controllers/base/controller", function(exports, require, module) {
  var Chaplin, Controller, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Controller;

  })(Chaplin.Controller);
  
});
window.require.register("controllers/home-controller", function(exports, require, module) {
  var BackgroundIndexView, CategorizerService, ChromeService, Controller, HomeController, NewscatService, ReadabilityService, ReadingScore, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  BackgroundIndexView = require('views/background/index-view');

  ChromeService = require('services/chrome-service');

  CategorizerService = require('services/categorizer-service');

  ReadabilityService = require('services/readability-service');

  NewscatService = require('services/newscat-service');

  ReadingScore = require('lib/reading-score');

  module.exports = HomeController = (function(_super) {
    __extends(HomeController, _super);

    function HomeController() {
      _ref = HomeController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeController.services = {
      chromeService: new ChromeService,
      newscatService: new NewscatService
    };

    HomeController.prototype.initialize = function() {
      this.publishEvent('listen:onUpdatedTab');
      return this.publishEvent('listen:activityPort');
    };

    HomeController.prototype.index = function() {
      return this.view = new BackgroundIndexView;
    };

    return HomeController;

  })(Controller);
  
});
window.require.register("controllers/popup-activity-controller", function(exports, require, module) {
  var ActivityChartView, NewPageVisits, NewPageVisitsView, PopupActivityController, PopupActivityView, PopupSiteController, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PopupSiteController = require('controllers/popup-site-controller');

  PopupActivityView = require('views/popup/activity-view');

  NewPageVisitsView = require('views/collections/new-page-visits-view');

  ActivityChartView = require('views/charts/activity-chart-view');

  NewPageVisits = require('models/NewPageVisits');

  module.exports = PopupActivityController = (function(_super) {
    __extends(PopupActivityController, _super);

    function PopupActivityController() {
      _ref = PopupActivityController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupActivityController.prototype.show = function() {
      var activityChartView, newPageVisitsView, npv;

      this.view = new PopupActivityView({
        region: 'popup-main'
      });
      npv = new NewPageVisits;
      npv.fetch();
      activityChartView = new ActivityChartView({
        collection: npv,
        autoRender: true,
        container: this.el,
        region: 'activity-chart'
      });
      activityChartView.initChart();
      return newPageVisitsView = new NewPageVisitsView({
        collection: npv,
        region: 'recent-page-visits'
      });
    };

    return PopupActivityController;

  })(PopupSiteController);
  
});
window.require.register("controllers/popup-goals-controller", function(exports, require, module) {
  var GoalsChartView, PopupGoalsController, PopupGoalsView, PopupSiteController, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PopupSiteController = require('controllers/popup-site-controller');

  PopupGoalsView = require('views/popup/goals-view');

  GoalsChartView = require('views/charts/goals-chart-view');

  module.exports = PopupGoalsController = (function(_super) {
    __extends(PopupGoalsController, _super);

    function PopupGoalsController() {
      _ref = PopupGoalsController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupGoalsController.prototype.show = function() {
      var goalsChartView;

      this.view = new PopupGoalsView({
        region: 'popup-main'
      });
      goalsChartView = new GoalsChartView({
        autoRender: true,
        container: this.el,
        region: 'goals-chart'
      });
      return goalsChartView.initChart();
    };

    return PopupGoalsController;

  })(PopupSiteController);
  
});
window.require.register("controllers/popup-prescription-controller", function(exports, require, module) {
  var PopupPrescriptionController, PopupPrescriptionView, PopupSiteController, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PopupSiteController = require('controllers/popup-site-controller');

  PopupPrescriptionView = require('views/popup/prescription-view');

  module.exports = PopupPrescriptionController = (function(_super) {
    __extends(PopupPrescriptionController, _super);

    function PopupPrescriptionController() {
      _ref = PopupPrescriptionController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupPrescriptionController.prototype.show = function() {
      return this.view = new PopupPrescriptionView({
        region: 'popup-main'
      });
    };

    return PopupPrescriptionController;

  })(PopupSiteController);
  
});
window.require.register("controllers/popup-site-controller", function(exports, require, module) {
  var Controller, PopupFooterView, PopupHeaderView, PopupSiteController, PopupSiteView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  PopupSiteView = require('views/popup/site-view');

  PopupHeaderView = require('views/popup/header-view');

  PopupFooterView = require('views/popup/footer-view');

  module.exports = PopupSiteController = (function(_super) {
    __extends(PopupSiteController, _super);

    function PopupSiteController() {
      _ref = PopupSiteController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupSiteController.prototype.beforeAction = {
      '.*': function() {
        this.compose('popup-site', PopupSiteView);
        this.compose('popup-header', PopupHeaderView, {
          region: 'popup-header'
        });
        return this.compose('popup-footer', PopupFooterView, {
          region: 'popup-footer'
        });
      }
    };

    PopupSiteController.prototype.initialize = function() {
      PopupSiteController.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('activity_tab', (function() {
        return this.redirectTo('#activity');
      }));
      this.subscribeEvent('goals_tab', (function() {
        return this.redirectTo('#goals');
      }));
      this.subscribeEvent('prescription_tab', (function() {
        return this.redirectTo('#prescription');
      }));
      return this.subscribeEvent('display:NewPageVisits', (function() {
        return this.redirectTo('#NewPageVisits');
      }));
    };

    return PopupSiteController;

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
    },
    validListenUrl: function(url) {
      var falseConditions, testAll;

      falseConditions = [/^chrome/i.test(url), /www.google.com\/search/i.test(url)];
      testAll = _.reduce(falseConditions, (function(element, memo) {
        return memo = memo || element;
      }), false, this);
      return !testAll;
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
window.require.register("models/Category", function(exports, require, module) {
  var Category, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Category = (function(_super) {
    __extends(Category, _super);

    function Category() {
      _ref = Category.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Category.prototype.defaults = {
      name: "",
      count: 0
    };

    Category.prototype.name = void 0;

    Category.prototype.count = void 0;

    return Category;

  })(Model);
  
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
      category: "other"
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
    match('public/popup.html', 'popup-activity#show');
    match('#activity', 'popup-activity#show');
    match('#goals', 'popup-goals#show');
    match('#prescription', 'popup-prescription#show');
    return match('#NewPageVisits', 'popup-activity#newPageVisits');
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
  var Chaplin, ChromeService, NewPageVisits, PageVisit, Service, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require('lib/utils');

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

        if ((changeInfo.url === void 0) || !utils.validListenUrl(changeInfo.url)) {
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
        return port.onMessage.addListener(function(msg, senderPort) {
          if (!senderPort.sender.tab.highlighted || !utils.validListenUrl(senderPort.sender.tab.url)) {
            return;
          }
          console.log(senderPort.sender.tab);
          console.log("Activity Update: " + JSON.stringify(msg));
          switch (msg.type) {
            case "update":
              return $.when(npv.fetch()).then(function() {
                return npv.findWhere({
                  url: senderPort.sender.tab.url
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
window.require.register("services/newscat-service", function(exports, require, module) {
  var Config, NewscatService, ReadingScore, Service, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require('lib/utils');

  Config = require('config');

  Service = require('services/base/service');

  ReadingScore = require('lib/reading-score');

  module.exports = NewscatService = (function(_super) {
    __extends(NewscatService, _super);

    function NewscatService() {
      NewscatService.__super__.constructor.apply(this, arguments);
      this.subscribeEvent('add:PageVisit', this.categorize);
    }

    NewscatService.prototype.categorize = function(pageVisit) {
      var pageUrl;

      pageUrl = pageVisit.attributes.url;
      if (pageUrl === null) {
        return;
      }
      console.log("sending " + pageUrl + " to newscat for nomz");
      return $.ajax({
        url: Config.newscatEndpoint + ("?url=" + pageUrl)
      }).done(function(data) {
        return pageVisit.save({
          category: data['best-category'],
          title: data.title,
          content: data.content,
          wordCount: data.word_count,
          readingScore: (new ReadingScore($(data.content).text())).fleschKincaid()
        });
      }).fail(function(data) {
        console.log("Ajax request failed");
        return console.log(data);
      });
    };

    return NewscatService;

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
window.require.register("views/background/index-view", function(exports, require, module) {
  var BackgroundIndexView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/background/index');

  module.exports = BackgroundIndexView = (function(_super) {
    __extends(BackgroundIndexView, _super);

    function BackgroundIndexView() {
      _ref = BackgroundIndexView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BackgroundIndexView.prototype.template = template;

    BackgroundIndexView.prototype.autoRender = true;

    return BackgroundIndexView;

  })(View);
  
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
window.require.register("views/charts/activity-chart-view", function(exports, require, module) {
  var ActivityChartView, Chaplin, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  template = require('views/templates/charts/activity-chart');

  module.exports = ActivityChartView = (function(_super) {
    var business_color, entertainment_color, other_color, politics_color, science_color, sports_color, technology_color;

    __extends(ActivityChartView, _super);

    function ActivityChartView() {
      _ref = ActivityChartView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ActivityChartView.prototype.el = $('#activity-chart-container');

    ActivityChartView.prototype.autoRender = true;

    ActivityChartView.prototype.autoAttach = true;

    ActivityChartView.prototype.template = template;

    politics_color = "#F7464A";

    business_color = "#E2EAE9";

    technology_color = "#D4CCC5";

    sports_color = "#ccc";

    science_color = "#9c9c9c";

    entertainment_color = "#000";

    other_color = "#c30000";

    ActivityChartView.prototype.parsePageVisits = function() {
      var counter, page_visit, page_visit_count, page_visits, page_visits_dict, _i, _len;

      page_visit_count = this.collection.length;
      page_visits = this.collection.models;
      page_visits_dict = {
        'politics': 0,
        'business': 0,
        'technology': 0,
        'sports': 0,
        'science': 0,
        'entertainment': 0,
        'other': 0
      };
      for (_i = 0, _len = page_visits.length; _i < _len; _i++) {
        page_visit = page_visits[_i];
        counter = (page_visit.attributes.updated_at - page_visit.attributes.created_at) / 1000;
        page_visits_dict[page_visit.attributes.category] += counter;
      }
      return page_visits_dict;
    };

    ActivityChartView.prototype.initChart = function() {
      var activityChart, ctx, data, page_visits_by_category;

      window.npv = this.collection;
      page_visits_by_category = this.parsePageVisits();
      ctx = document.getElementById('activity-chart').getContext("2d");
      data = [
        {
          value: page_visits_by_category['politics'],
          color: politics_color
        }, {
          value: page_visits_by_category['business'],
          color: business_color
        }, {
          value: page_visits_by_category['technology'],
          color: technology_color
        }, {
          value: page_visits_by_category['sports'],
          color: sports_color
        }, {
          value: page_visits_by_category['science'],
          color: science_color
        }, {
          value: page_visits_by_category['entertainment'],
          color: entertainment_color
        }, {
          value: page_visits_by_category['other'],
          color: other_color
        }
      ];
      return activityChart = new Chart(ctx).Doughnut(data);
    };

    return ActivityChartView;

  })(View);
  
});
window.require.register("views/charts/goals-chart-view", function(exports, require, module) {
  var Chaplin, GoalsChartView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  template = require('views/templates/charts/goals-chart');

  module.exports = GoalsChartView = (function(_super) {
    __extends(GoalsChartView, _super);

    function GoalsChartView() {
      _ref = GoalsChartView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GoalsChartView.prototype.el = $('#goals-chart-container');

    GoalsChartView.prototype.autoRender = true;

    GoalsChartView.prototype.autoAttach = true;

    GoalsChartView.prototype.template = template;

    GoalsChartView.prototype.initChart = function() {
      var chart, data, labels;

      data = [4, 8, 15, 16, 23, 32];
      labels = {
        4: 'Food',
        8: 'Politics',
        15: 'Science',
        16: 'Tech',
        23: 'Business',
        32: 'Sports'
      };
      chart = d3.select('#goals-chart-container').append('div').attr('class', 'chart');
      return chart.selectAll("div").data(data).enter().append("div").style("width", function(d) {
        return d * 10 + "px";
      }).text(function(d) {
        return labels[d];
      });
    };

    return GoalsChartView;

  })(View);
  
});
window.require.register("views/collections/new-page-visits-view", function(exports, require, module) {
  var CollectionView, NewPageVisitsView, PageVisitView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/collection-view');

  CollectionView = require('views/base/collection-view');

  template = require('views/templates/collections/new-page-visits');

  PageVisitView = require('views/models/page-visit-view');

  module.exports = NewPageVisitsView = (function(_super) {
    __extends(NewPageVisitsView, _super);

    function NewPageVisitsView() {
      _ref = NewPageVisitsView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewPageVisitsView.prototype.autoRender = true;

    NewPageVisitsView.prototype.autoAttach = true;

    NewPageVisitsView.prototype.template = template;

    NewPageVisitsView.prototype.itemView = PageVisitView;

    NewPageVisitsView.prototype.listSelector = '#new-page-visits-list';

    return NewPageVisitsView;

  })(CollectionView);
  
});
window.require.register("views/models/page-visit-view", function(exports, require, module) {
  var PageVisitView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/models/page-visit');

  module.exports = PageVisitView = (function(_super) {
    __extends(PageVisitView, _super);

    function PageVisitView() {
      _ref = PageVisitView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PageVisitView.prototype.autoRender = true;

    PageVisitView.prototype.template = template;

    PageVisitView.prototype.tagname = 'div';

    PageVisitView.prototype.render = function() {
      return PageVisitView.__super__.render.apply(this, arguments);
    };

    return PageVisitView;

  })(View);
  
});
window.require.register("views/popup/activity-view", function(exports, require, module) {
  var ActivityView, Chaplin, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  template = require('views/templates/popup/activity');

  module.exports = ActivityView = (function(_super) {
    __extends(ActivityView, _super);

    function ActivityView() {
      _ref = ActivityView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ActivityView.prototype.className = 'popup-activity';

    ActivityView.prototype.autoRender = true;

    ActivityView.prototype.autoAttach = true;

    ActivityView.prototype.template = template;

    ActivityView.prototype.regions = {
      '#activity-chart-container': 'activity-chart',
      '#recent-page-visits': 'recent-page-visits'
    };

    return ActivityView;

  })(View);
  
});
window.require.register("views/popup/footer-view", function(exports, require, module) {
  var PopupFooterView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/popup/footer');

  module.exports = PopupFooterView = (function(_super) {
    __extends(PopupFooterView, _super);

    function PopupFooterView() {
      _ref = PopupFooterView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupFooterView.prototype.template = template;

    PopupFooterView.prototype.autoRender = true;

    PopupFooterView.prototype.className = 'popup-footer';

    PopupFooterView.prototype.id = 'popup-footer';

    return PopupFooterView;

  })(View);
  
});
window.require.register("views/popup/goals-view", function(exports, require, module) {
  var GoalsView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/popup/goals');

  module.exports = GoalsView = (function(_super) {
    __extends(GoalsView, _super);

    function GoalsView() {
      _ref = GoalsView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GoalsView.prototype.className = 'popup-goals';

    GoalsView.prototype.autoRender = true;

    GoalsView.prototype.autoAttach = true;

    GoalsView.prototype.template = template;

    GoalsView.prototype.initialize = function() {
      return this.delegate('click', '#edit-goals', this.showForm);
    };

    GoalsView.prototype.showForm = function() {
      $('#goals-chart-container').toggle();
      $('#goals-form-container').toggle();
      if ($('#goals-form-container').css('display') === "block") {
        $('#edit-goals').text('Save Goals');
      }
      if ($('#goals-form-container').css('display') === "none") {
        return $('#edit-goals').text('Edit Goals');
      }
    };

    GoalsView.prototype.showChart = function() {
      $('#goals-chart-container').toggle();
      return $('#goals-form-contrainer').toggle();
    };

    GoalsView.prototype.regions = {
      '#goals-header-container': 'goals-header',
      '#goals-chart-container': 'goals-chart'
    };

    return GoalsView;

  })(View);
  
});
window.require.register("views/popup/header-view", function(exports, require, module) {
  var Chaplin, HeaderView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  Chaplin = require('chaplin');

  template = require('views/templates/popup/header');

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.className = 'popup-header';

    HeaderView.prototype.id = 'popup-header';

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
window.require.register("views/popup/prescription-view", function(exports, require, module) {
  var PrescriptionView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/popup/prescription');

  module.exports = PrescriptionView = (function(_super) {
    __extends(PrescriptionView, _super);

    function PrescriptionView() {
      _ref = PrescriptionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PrescriptionView.prototype.className = 'popup-prescription';

    PrescriptionView.prototype.autoRender = true;

    PrescriptionView.prototype.autoAttach = true;

    PrescriptionView.prototype.template = template;

    PrescriptionView.prototype.regions = {
      '#greeting': 'greeting',
      '#doctor-prescription': 'doctor-prescription',
      '#prescription-list': 'prescription-list'
    };

    return PrescriptionView;

  })(View);
  
});
window.require.register("views/popup/site-view", function(exports, require, module) {
  var PopupSiteView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/popup/site');

  module.exports = PopupSiteView = (function(_super) {
    __extends(PopupSiteView, _super);

    function PopupSiteView() {
      _ref = PopupSiteView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupSiteView.prototype.container = 'body';

    PopupSiteView.prototype.id = 'popup-site-container';

    PopupSiteView.prototype.regions = {
      '#popup-header-container': 'popup-header',
      '#popup-main-container': 'popup-main',
      '#popup-footer-container': 'popup-footer'
    };

    PopupSiteView.prototype.template = template;

    return PopupSiteView;

  })(View);
  
});
window.require.register("views/templates/background/index", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<p>Slimformation - Background Page</p>";
    });
});
window.require.register("views/templates/charts/activity-chart", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "test\n";
    });
});
window.require.register("views/templates/charts/goals-chart", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "test\n";
    });
});
window.require.register("views/templates/collections/new-page-visits", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"span12\">\n  <table id=\"recent-page-visits\" class=\"table table-striped table-condensed table-hover\">\n    <h2>Your recently visited pages</h2>\n    <tbody id=\"new-page-visits-list\"></tbody>\n  </table>\n</div>\n";
    });
});
window.require.register("views/templates/models/page-visit", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "\n<tr>\n  <td>\"";
    if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\"</td>\n  <td>";
    if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.category; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n</tr>";
    return buffer;
    });
});
window.require.register("views/templates/popup/activity", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div id=\"activity-chart-container\" class=\"container\">\n  <canvas id=\"activity-chart\" width=\"250\" height=\"250\"></canvas>\n</div>\n<div id=\"recent-page-visits\"></div>\n";
    });
});
window.require.register("views/templates/popup/footer", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<a class=\"btn btn-large span12\">\n  View My Dashboard\n</a>";
    });
});
window.require.register("views/templates/popup/goals", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div id=\"goals-header-container\" class=\"container\" style=\"margin:3%;\">\n  <button class=\"btn btn-mini btn-inverse\" href=\"#\" id=\"edit-goals\" style=\"float:right\">\n    Edit Goals\n  </button>\n  <b style=\"font-size:24px\">Weekly Reading Goals</b>\n</div>\n\n<div id=\"goals-chart-container\" class=\"container\">\n</div>\n\n<div id=\"goals-form-container\" class=\"container\" style=\"display:none;margin:3%;\">\n  <div id=\"all-sliders\" style=\"margin:10%\">\n    <div class=\"progress\">\n      <div class=\"bar\" style=\"width:30%;\"></div>\n      <div class=\"bar bar-warning\" style=\"width:20%;\"></div>\n    </div>\n  </div>\n  \n</div>\n";
    });
});
window.require.register("views/templates/popup/header", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"navbar\">\n  <div class=\"navbar-inner\">\n    <a class=\"brand\"></a>\n    <ul class=\"nav\">\n      <li class=\"activity\"><a href=\"#\">Activity</a></li>\n      <li class=\"goals\"><a href=\"#\">Goals</a></li>\n      <li class=\"prescription\"><a href=\"#\">Prescription</a></li>\n    </ul>\n  </div>\n</div>\n";
    });
});
window.require.register("views/templates/popup/prescription", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div id=\"greeting\">Hello!</div></br>\n<div id=\"doctor-prescription\">The doctor is in! You met <strong>60%</strong> of your goals! There's still room for improvement!</div></br>\n<div id=\"prescription-list\">Here are some suggestions to improve your content diet:</br>\n<strong>1.</strong> You did not meet your set goal of <strong>6 hours</strong> for <strong>politics</strong>, so read more <a target=\"_blank\" href=\"http://www.usatoday.com/news/politics/\">politics<a/>.</br></br>\n<strong>2.</strong> You did not meet your set goal of <strong>4 hours</strong> for <strong>technology</strong>, so read more <a target=\"_blank\" href=\"http://www.nytimes.com/pages/technology/index.html‎\">technology<a/>.</br></br>\n<strong>3.</strong> You exceeded your set goal of <strong>3 hours</strong> for <strong>entertainment</strong>, so try cutting back.</br>\n</div>\n";
    });
});
window.require.register("views/templates/popup/site", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "";


    buffer += "<header id=\"popup-header-container\" class=\"popup-header-container\"></header>\n\n<div class=\"container outer-container\">\n"
      + "\n  <div id=\"popup-main-container\" class=\"container\" >\n  </div>\n</div>\n\n<footer id=\"popup-footer-container\" class=\"popup-footer-container\"></footer>";
    return buffer;
    });
});
