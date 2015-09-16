var page = require('page');
var React = require('react');
var PropTypes = React.PropTypes;

function irl() {

  var args = Array.prototype.slice.call(arguments);

  if (args.length < 3) return page.apply(this, args);

  var uri = args.shift();
  var callback = args.pop();
  var components = args;
  var First = components[0];

  page(uri, function (ctx) {

    var c = 1;

    function chain() {
      return components[c++] || null;
    }

    var Page = React.createClass({

      displayName: 'Page',

      getChildContext: function () {

        return {
          args: args,
          getChild: chain,
          components: components,
          route: ctx
        };

      },

      childContextTypes: {
        args: PropTypes.array.isRequired,
        getChild: PropTypes.func.isRequired,
        components: PropTypes.array.isRequired,
        route: PropTypes.object.isRequired
      },

      render: function() {
        return React.createElement(First);
      }

    });

    callback(Page, ctx);

  });

}

module.exports = irl;
