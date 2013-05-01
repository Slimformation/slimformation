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
    categorizerEndpoint: "http://gentle-mesa-7611.herokuapp.com/categorize.json"
  };

  module.exports = Config;
  
});
window.require.register("content_scripts/tab-reporter", function(exports, require, module) {
  console.log('I loaded the content script!');
  
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
  var ChromeService, Controller, HomeController, HomePageView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HomePageView = require('views/home-page-view');

  ChromeService = require('services/chrome-service');

  module.exports = HomeController = (function(_super) {
    __extends(HomeController, _super);

    function HomeController() {
      _ref = HomeController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeController.services = chrome - {
      service: new ChromeService
    };

    HomeController.prototype.initialize = function() {
      return this.publishEvent('listen:onUpdatedTab');
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
  var Controller, PopupController, PopupView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  PopupView = require('views/popup-view');

  module.exports = PopupController = (function(_super) {
    __extends(PopupController, _super);

    function PopupController() {
      _ref = PopupController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupController.prototype.index = function() {
      return this.view = new PopupView({
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

    PageVisit.prototype.initialize = function() {
      this.set('created_at', (new Date()).getTime());
      return this.subscribeEvent('add', this.categorize);
    };

    PageVisit.prototype.created_at = null;

    PageVisit.prototype.url = null;

    PageVisit.prototype.category = null;

    PageVisit.prototype.categorize = function(pageVisit) {
      var pageUrl;

      pageUrl = pageVisit.attributes.url;
      console.log("trying to categorize " + pageUrl);
      if (pageUrl === null) {
        return;
      }
      return $.ajax({
        url: Config.categorizerEndpoint + ("?url=" + (utils.removeProtocol(pageUrl)))
      }).done(function(data) {
        return pageVisit.save({
          category: data.category
        });
      });
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
    return match('public/popup.html', 'popup#index');
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
    }

    ChromeService.prototype.onUpdatedTab = function() {
      return chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        var npv, pv;

        if (changeInfo.url === void 0) {
          return;
        }
        console.log("Update: the url of tab " + tabId + " changed to " + changeInfo.url);
        npv = new NewPageVisits;
        pv = npv.create({
          url: changeInfo.url
        });
        return Chaplin.mediator.publish('add', pv);
      });
    };

    return ChromeService;

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
window.require.register("views/header-view", function(exports, require, module) {
  var HeaderView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

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

    PopupView.prototype.autoRender = true;

    PopupView.prototype.className = 'popup';

    PopupView.prototype.template = template;

    return PopupView;

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
window.require.register("views/templates/header", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"navbar\">\n  <div class=\"navbar-inner\">\n    <a class=\"brand\" href=\"#\">Title</a>\n    <ul class=\"nav\">\n      <li class=\"active\"><a href=\"#\">Home</a></li>\n      <li><a href=\"#\">Link</a></li>\n      <li><a href=\"#\">Link</a></li>\n    </ul>\n  </div>\n</div>\n";
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
window.require.register("views/templates/site", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<header id=\"header-container\" class=\"header-container\"></header>\n\n<div class=\"container outer-container\">\n  <div id=\"page-container\" class=\"container\" >\n  </div>\n</div>\n";
    });
});
