(function() {
  requirejs.config({
    paths: {
      jquery: "/components/jquery/jquery.min",
      underscore: "/components/underscore/underscore-min",
      bootstrap: "/components/bootstrap/js/bootstrap.min"
    },
    shim: {
      underscore: {
        exports: "_"
      },
      bootstrap: {
        deps: ["jquery"],
        exports: "jQuery"
      }
    }
  });

  require(['bootstrap'], function(bootstrap) {
    return null;
  });

}).call(this);
