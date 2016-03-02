var React = require('react')
var Empty = require('./Empty')
var assign = require('object-assign')

var createElement = React.createElement
var createClass = React.createClass
var PropTypes = React.PropTypes

function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

function once (fn) {
  var aborted = false

  return {
    abort: function () {
      aborted = true
    },

    run: function () {
      if (aborted) return

      fn.apply(this, arguments)
    }
  }
}

module.exports = function (loader, SuccessComponent, ErrorComponent, LoadingComponent) {
  var component = {
    success: SuccessComponent,
    loading: LoadingComponent || Empty,
    error: ErrorComponent || Empty
  }

  var payload

  return createClass({
    displayName: 'Async',

    contextTypes: {
      route: PropTypes.object.isRequired,
      transitionTo: PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        status: 'loading'
      }
    },

    redirectOnError: function () {
      if (typeof ErrorComponent === 'string') {
        this.context.transitionTo(ErrorComponent)
        return true
      }

      if (ErrorComponent && typeof ErrorComponent === 'object') {
        this.context.transitionTo(ErrorComponent.name, ErrorComponent.params, ErrorComponent.query)
        return true
      }

      return false
    },

    onResolve: function (data) {
      payload = data

      this.setState({status: 'success'})
    },

    onReject: function (data) {
      payload = data

      if (this.redirectOnError()) {
        return
      }

      this.setState({status: 'error'})
    },

    update: function (nextRoute) {
      var response, threw, onResolved, onRejected

      if (this.abortPreviousNavigation) {
        this.abortPreviousNavigation()
      }

      try {
        response = loader(nextRoute || this.context.route)
      } catch (e) {
        threw = true
        response = e
      }

      if (isPromise(response)) {
        this.setState({status: 'loading'})

        onResolved = once(this.onResolve)
        onRejected = once(this.onReject)

        this.abortPreviousNavigation = function () {
          onResolved.abort()
          onRejected.abort()
        }

        response
          .then(onResolved.run)
          .catch(onRejected.run)
      } else {
        if (threw && this.redirectOnError()) {
          return
        }

        this.setState({
          status: threw ? 'error' : 'success'
        })

        payload = response
      }
    },

    componentDidMount: function () {
      this.update()
    },

    componentWillReceiveProps: function (nextProps, nextContext) {
      if (this.context.route.path !== nextContext.route.path) {
        this.update(nextContext.route)
      }
    },

    render: function () {
      var props = {payload: payload}

      assign(props, this.props)

      return createElement(
        component[this.state.status],
        props,
        this.props.children
      )
    }
  })
}
