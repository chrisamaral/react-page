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
          getPathFor: getRoute.getPathFor
        };

      },

      childContextTypes: {

        childComponent: PropTypes.func.isRequired,
        route: PropTypes.object.isRequired,
        getPathFor: PropTypes.func.isRequired

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
