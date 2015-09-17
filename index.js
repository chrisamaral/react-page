var page = require('page');
var React = require('react');
var PropTypes = React.PropTypes;
var createElement = React.createElement;

var Page = React.createClass({

  displayName: 'Page',

  getChildContext: function () {

    return {
      getChild: this.props.getSubRoute,
      route: this.props.route
    };

  },

  childContextTypes: {
    getChild: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired
  },

  render: function () {
    return createElement(this.props.Root);
  }

});

function irl() {

  var args = Array.prototype.slice.call(arguments);

  if (args.length < 3) return page.apply(this, args);

  var uri = args.shift();
  var callback = args.pop();
  var components = args;

  var index = 1;

  function getSubRoute() {
    if (index === components.length) {
      index = 1;
    }
    return components[index++] || null;
  }

  page(uri, function (ctx) {

    callback(createElement(Page, {
        getSubRoute: getSubRoute,
        route: ctx,
        Root: components[0]
      }));

  });

}

module.exports = irl;
