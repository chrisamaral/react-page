var React = require('react');
var createElement = React.createElement;
var createClass = React.createClass;
var Empty = require('./Empty');

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

    render: function () {

      var props = {payload: config.payload};

      var parentProps = this.props;


      for (var key in parentProps) {
        if (parentProps.hasOwnProperty(key)) {
          props[key] = parentProps[key];
        }
      }

      return Boolean(config.Current) &&
        createElement(
          config.Current,
          props,
          this.props.children
        );

    }

  });

}

function Async(loader, Success, Error, Loading) {

  this.load = loader;
  this.Success = Success;
  this.Error = Error || Empty;
  this.Loading = Loading || Empty;

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

  this.payload = payload;
  this.Current = this.Success;
  this.instance.forceUpdate();

};

Async.prototype.onReject = function (payload) {

  this.payload = payload;
  this.Current = this.Error;
  this.instance.forceUpdate();

};

Async.prototype.getComponent = function () {

  delete this.payload;

  this.Current = this.Loading;

  this.lock = Date.now();

  var response, threw;

  try {
    response = this.load();
  } catch (e) {
    threw = true;
    response = e;
  }

  if (!this.Component) {
    this.Component = Wrap(this);
  }

  if (isPromise(response)) {

    response
      .then(this.once(this.onResolve))
      .catch(this.once(this.onReject))

  } else {
    this.Current = threw ? this.Error : this.Success;
    this.payload = response;
  }

  return this.Component;

};

module.exports = Async;
