var page = require('page');
var React = require('react');

var PropTypes = React.PropTypes;
var createElement = React.createElement;
var createClass = React.createClass;
var AsyncWrap = require('./AsyncWrap');

var routes = [];

function safe(component) {
  return component instanceof AsyncWrap
    ? component.getComponent()
    : component;
}

function find(component) {
  var route;

  for (var i = 0; i < routes.length; i++) {
    if (routes[i].component === component) {
      route = routes[i].route;
      break;
    }
  }

  return route;
}

function getRoute(components, context) {

  var component = safe(components.shift());

  if (!component) {
    return null;
  }

  var route = find(component);

  if (!route) {

    route = createClass({

      displayName: 'Route',

      getChildContext: function () {
        return {
          childComponent: route.childComponent,
          route: context
        };
      },

      childContextTypes: {
        childComponent: PropTypes.func.isRequired,
        route: PropTypes.object.isRequired
      },

      render: function () {
        return component
          ? createElement(component, this.props, this.props.children)
          : null;
      }

    });

    routes.push({
      component: component,
      route: route
    })
  }

  route.childComponent = getRoute(components, context);

  return route;

}

function reactPage() {

  var args = Array.prototype.slice.call(arguments);

  if (args.length < 3) return page.apply(this, args);

  var uri = args.shift();
  var callback = args.pop();
  var components = args;

  page(uri, function (ctx) {

    callback(
      getRoute(
        components.concat(),
        ctx
      )
    );

  });

}

reactPage.resolve = function (loader) {
  return new AsyncWrap(loader);
};

module.exports = reactPage;
