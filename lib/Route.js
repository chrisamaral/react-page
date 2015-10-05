var React = require('react');

var Empty = require('./Empty');

var PropTypes = React.PropTypes;
var createElement = React.createElement;
var createClass = React.createClass;

var handlers = [];

function find(component) {
  var handler;

  for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].component === component) {
      handler = handlers[i].handler;
      break;
    }
  }

  return handler;
}

function reactRouterCompat(context) {

  var r = function () {};

  r.getCurrentPathname = function () {
    return context.pathname;
  };

  r.getCurrentQuery = function () {
    return context.query;
  };

  r.getCurrentParams = function () {
    return context.params;
  };

  r.getCurrentPath = function () {
    return context.path;
  };

  r.transitionTo = getRoute.transitionTo;

  r.replaceWith = getRoute.transitionTo;

  return r;
}

function getRoute(components, context) {

  var component = components.shift();

  if (!component) {
    return Empty;
  }

  var handler = find(component);

  if (!handler) {

    handler = createClass({

      displayName: 'Route',

      getChildContext: function () {

        return {
          childComponent: handler.childComponent,
          route: handler.currentRoute,
          routes: getRoute.routes,
          transitionTo: getRoute.transitionTo,
          router: reactRouterCompat(handler.currentRoute)
        };

      },

      childContextTypes: {

        childComponent: PropTypes.func.isRequired,
        route: PropTypes.object.isRequired,
        routes: PropTypes.object.isRequired,
        transitionTo: PropTypes.func.isRequired,
        router: PropTypes.func.isRequired

      },

      render: function () {
        return component
          ? createElement(component, this.props, this.props.children)
          : null;
      }

    });

    handlers.push({
      component: component,
      handler: handler
    });

  }

  handler.currentRoute = context;
  handler.childComponent = getRoute(components, context);

  return handler;

}

module.exports = getRoute;
