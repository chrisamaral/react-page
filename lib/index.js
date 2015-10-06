var page = require('page');
var Route = require('./Route');
var qs = require('qs');
var assign = require('object-assign');
var pathToRegexp = require('path-to-regexp');
var routes = {};

Route.routes = routes;

function reactPage() {

  var args = Array.prototype.slice.call(arguments);

  if (args.length < 3) return page.apply(this, args);

  var uri = args.shift();
  var name;

  if (typeof args[0] === 'string') {

    name = uri;
    uri = args.shift();

    routes[name] = pathToRegexp.compile(uri);

  }

  var callback = args.pop();
  var components = args;

  page(uri, function (ctx) {

    ctx.name = name;
    ctx.query = qs.parse(ctx.querystring);

    setTimeout(function () {

      callback(
        Route(
          components.concat(),
          ctx
        )
      );

    }, 0);

  });

}

function transitionTo(name, params, query) {

  var compiler = routes[name];
  var queryString = typeof query === 'object' ? qs.stringify(query) : '';

  page(
    (compiler ? compiler(params) : name) +
    (queryString ? '?' + queryString : '')
  );

}

function navigateTo(name, params, query) {

  params = assign({}, params);
  query = assign({}, query);

  var nav = {};

  function setParams(p, x) {

    if (typeof p === 'object') {
      assign(params, p);
    } else {
      params[p] = x;
    }

    return nav;
  }

  function setQuery(q, x) {

    if (typeof q === 'object') {
      assign(query, q);
    } else {
      params[q] = x;
    }

    return nav;
  }

  nav.with = setParams;
  nav.where = setQuery;
  nav.and = nav;

  nav.go = function () {
    transitionTo(name, params, query);
  };

  return nav;

}

Route.transitionTo = transitionTo;
reactPage.transitionTo = transitionTo;

reactPage.navigate = {
  to: navigateTo,

  from: function (ctx) {
    return {
      to: function (name) {
        return navigateTo(name, ctx.params, ctx.query);
      }
    }
  }
};

reactPage.use = {};

reactPage.set = function (render) {

  var components = [];

  var three = {};

  three.run = page;

  three.on = function () {

    var args = Array.prototype.slice.call(arguments);
    var config = components.concat();

    if (typeof args[1] === 'string') {
      config.unshift(args[1]);
      args.splice(1, 1);
    }

    config.unshift(args[0]);

    args.shift();
    args.push(render);

    config = config.concat(args);

    reactPage.apply(null, config);

    return three;
  };

  three.rewind = function () {

    components = [];

    return three;
  };

  three.with = function () {

    components = components.concat(Array.prototype.slice.call(arguments));

    return three;

  };

  return three;
};

reactPage.RouteHandler = require('./RouteHandler');
reactPage.Link = require('./Link');
reactPage.when = require('./Async');

reactPage.redirect = page.redirect;
reactPage.show = page.show;
reactPage.start = page.start;
reactPage.stop = page.stop;
reactPage.base = page.base;
reactPage.exit = page.exit;

module.exports = reactPage;
