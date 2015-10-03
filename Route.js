var React = require('react');

var Empty = require('./Empty');

var PropTypes = React.PropTypes;
var createElement = React.createElement;
var createClass = React.createClass;

var routes = [];

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

  var component = components.shift();

  if (!component) {
    return Empty;
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

module.exports = getRoute;
