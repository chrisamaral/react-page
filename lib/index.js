var page = require('page');
var Route = require('./Route');
var qs = require('qs');
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

    ctx.query = qs.parse(ctx.querystring);

    callback(
      Route(
        components.concat(),
        ctx
      )
    );

  });

}

reactPage.Link = require('./Link');
reactPage.when = require('./Async');

reactPage.redirect = page.redirect;
reactPage.show = page.show;
reactPage.start = page.start;
reactPage.stop = page.stop;
reactPage.base = page.base;
reactPage.exit = page.exit;

module.exports = reactPage;
