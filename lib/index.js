var page = require('page');
var Route = require('./Route');
var qs = require('qs');
var assign = require('object-assign');
var pathToRegexp = require('path-to-regexp');
var routes = {};

function getPathFor(name) {

  if (!routes[name]) {
    throw new Error('Could not compile the path for "' + name + '" because there is no such route.');
  }

  return routes[name];
}

Route.getPathFor = getPathFor;

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

    callback(
      Route(
        components.concat(),
        ctx
      )
    );

  });

}

function transitionTo(name, params, query) {

  var queryString = qs.stringify(query);

  page(
    getPathFor(name)(params) +
    (queryString ? '?' + queryString : '')
  );

}

function navigateTo(name, params, query) {

  params = assign({}, params);
  query = assign({}, query);

  var navigator = {};

  function setParams(p, x) {

    if (typeof p === 'object') {
      assign(params, p);
    } else {
      params[p] = x;
    }

    return navigator;
  }

  function setQuery(q, x) {

    if (typeof q === 'object') {
      assign(query, q);
    } else {
      params[q] = x;
    }

    return navigator;
  }

  navigator.with = setParams;
  navigator.where = setQuery;
  navigator.and = navigator;

  navigator.go = function () {
    transitionTo(name, params, query);
  };

  return navigator;

}

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

reactPage.Link = require('./Link');
reactPage.when = require('./Async');

reactPage.redirect = page.redirect;
reactPage.show = page.show;
reactPage.start = page.start;
reactPage.stop = page.stop;
reactPage.base = page.base;
reactPage.exit = page.exit;

module.exports = reactPage;
