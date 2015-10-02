var React = require('react');
var createElement = React.createElement;
var createClass = React.createClass;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function Wrap(config) {

  return createClass({

    displayName: 'Async',

    componentDidMount: function () {

      config.instance = this;

    },

    componentWillUnmount: function () {

      delete config.instance;

    },

    mergeProps: function (props) {

      var parentProps = this.props;

      for (var key in parentProps) {
        if (parentProps.hasOwnProperty(key)) {
          props[key] = parentProps[key];
        }
      }

      return props;

    },

    render: function () {
      var status = 'Loading';
      var resolved = {};

      if (config.error) {

        status = 'Error';
        resolved.error = config.error;

      } else if (config.payload) {

        status = 'Success';
        resolved.payload = config.payload;

      }

      return createElement(
        config[status] || null,
        this.mergeProps(resolved),
        this.props.children
      );

    }

  });

}

function Async(loader) {

  this.load = loader;
  this.catch = this.catch.bind(this);
  this.then = this.then.bind(this);

}

Async.prototype.once = function (fn) {
  var key = this.lock;

  return function () {

    if (this.lock === key && this.instance) {
      fn.apply(this, arguments);
    }

  }.bind(this);
};

Async.prototype.lock = null;
Async.prototype.instance = null;
Async.prototype.Component = null;

Async.prototype.onResolve = function (payload) {

  delete this.error;
  this.payload = payload;
  this.instance.forceUpdate();

};

Async.prototype.onReject = function (error) {

  delete this.payload;
  this.error = error;
  this.instance.forceUpdate();

};

Async.prototype.catch = function (Error) {

  this.Error = Error;

  return this;

};

Async.prototype.then = function (Comp, Error) {

  if (Comp) {

    if (this.Loading) {
      this.Success = Comp;
    } else {
      this.Loading = Comp;
    }

  }

  if (Error) {
    this.Error = Error;
  }

  return this;
};

Async.prototype.getComponent = function () {

  delete this.error;
  delete this.payload;

  this.lock = Date.now();

  var response, err;

  try {
    response = this.load();
  } catch (e) {
    err = e;
  }

  this.Error = this.Error || this.Success;

  if (!this.Component) {
    this.Component = Wrap(this);
  }

  if (isPromise(response)) {

    response
      .then(this.once(this.onResolve))
      .catch(this.once(this.onReject))

  } else {
    this.error = err;
    this.payload = response;
  }

  return this.Component;

};

module.exports = Async;
