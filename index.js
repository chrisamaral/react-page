var page = require('page');
var Route = require('./Route');

function reactPage() {

  var args = Array.prototype.slice.call(arguments);

  if (args.length < 3) return page.apply(this, args);

  var uri = args.shift();
  var callback = args.pop();
  var components = args;

  page(uri, function (ctx) {

    callback(
      Route(
        components.concat(),
        ctx
      )
    );

  });

}

reactPage.when = require('./Async');

module.exports = reactPage;
