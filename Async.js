var React = require('react');
var Empty = require('./Empty');

var createElement = React.createElement;
var createClass = React.createClass;
var PropTypes = React.PropTypes;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

module.exports = function (loader, Success, Error, Loading) {

  var component = {
    success: Success,
    loading: Loading || Empty,
    error: Error || Empty
  };

  var payload, savedPath;

  return createClass({

    displayName: 'Async',

    contextTypes: {
      route: PropTypes.object.isRequired
    },

    getInitialState: function () {
      return {
        status: 'loading'
      };
    },

    getCurrentPath: function () {

      try {
        return this.context.route.path;
      } catch (e) {
        return null;
      }

    },

    once: function (fn) {

      var key = this.getCurrentPath();

      return function () {

        if (key === this.getCurrentPath()) {

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

      this.setState({status: 'error'});

    },

    update: function () {

      var response, threw;

      savedPath = this.getCurrentPath();

      try {
        response = loader();
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

        this.setState({
          status: threw ? 'error' : 'success'
        });

        payload = response;
      }

    },

    componentDidMount: function () {

      this.update();

    },

    componentWillReceiveProps: function () {

      if (savedPath !== this.getCurrentPath()) {

        this.update();
      }

    },

    render: function () {

      var props = {payload: payload};

      var parentProps = this.props;

      for (var key in parentProps) {
        if (parentProps.hasOwnProperty(key)) {
          props[key] = parentProps[key];
        }
      }

      return createElement(
          component[this.state.status],
          props,
          this.props.children
        );

    }

  });

};
