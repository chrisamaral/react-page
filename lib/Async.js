var React = require('react');
var Empty = require('./Empty');
var assign = require('object-assign');

var createElement = React.createElement;
var createClass = React.createClass;
var PropTypes = React.PropTypes;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

module.exports = function (loader, SuccessComponent, ErrorComponent, LoadingComponent) {

  var component = {
    success: SuccessComponent,
    loading: LoadingComponent || Empty,
    error: ErrorComponent || Empty
  };

  var payload, savedPath;

  return createClass({

    displayName: 'Async',

    contextTypes: {
      route: PropTypes.object.isRequired,
      transitionTo: PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        status: 'loading'
      };
    },

    redirectOnError: function () {

      if (typeof ErrorComponent === 'string') {
        this.context.transitionTo(ErrorComponent);
        return true;
      }

      if (ErrorComponent && typeof ErrorComponent === 'object') {
        this.context.transitionTo(ErrorComponent.name, ErrorComponent.params, ErrorComponent.query);
        return true;
      }

      return false;

    },

    once: function (fn) {

      var pathThen = savedPath;

      return function () {

        var pathNow = null;

        try {

          pathNow = this.context.route.path;

        } catch (e) {

          //

        }

        if (pathThen === pathNow) {

          fn.apply(this, arguments);

        }

      }.bind(this);

    },

    onResolve: function (data) {

      payload = data;

      this.setState({status: 'success'});

    },

    onReject: function (data) {

      payload = data;

      if (this.redirectOnError()) {
        return;
      }

      this.setState({status: 'error'});

    },

    update: function (currentPath) {

      var response, threw;

      savedPath = currentPath || this.context.route.path;

      try {
        response = loader(this.context.route);
      } catch (e) {
        threw = true;
        response = e;
      }

      if (isPromise(response)) {

        this.setState({status: 'loading'});

        response
          .then(this.once(this.onResolve))
          .catch(this.once(this.onReject));

      } else {

        if (threw && this.redirectOnError()) {
          return;
        }

        this.setState({
          status: threw ? 'error' : 'success'
        });

        payload = response;
      }

    },

    componentDidMount: function () {

      this.update();

    },

    componentWillReceiveProps: function (nextProps, nextContext) {

      if (savedPath !== nextContext.route.path) {

        this.update(nextContext.route.path);

      }

    },

    render: function () {

      var props = {payload: payload};

      assign(props, this.props);

      return createElement(
        component[this.state.status],
        props,
        this.props.children
      );

    }

  });

};
