var React = require('react')
var qs = require('qs')
var createClass = React.createClass
var PropTypes = React.PropTypes
var a = React.DOM.a
var assign = require('object-assign')

module.exports = createClass({
  displayName: 'Link',

  getDefaultProps: function () {
    return {
      mergeQuery: false,
      activeClassName: 'active',
      className: '',
      style: {}
    }
  },

  contextTypes: {
    route: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
  },

  propTypes: {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
    href: PropTypes.string,
    to: PropTypes.string,
    params: PropTypes.object,
    query: PropTypes.object,
    activeClassName: PropTypes.string,
    mergeQuery: PropTypes.bool,
    mergeParams: PropTypes.bool,
    target: PropTypes.string
  },

  render: function () {
    var attributes = {
      className: this.props.className,
      href: this.props.href,
      style: this.props.style,
      target: this.props.target
    }

    var currentRoute = this.context.route
    var params, query, pathCompiler

    if (typeof attributes.href === 'string') {
      attributes.href = attributes.href.replace(/^\.\//g, currentRoute.pathname + '/')
    }

    if (attributes.href === undefined) {
      pathCompiler = this.context.routes[this.props.to]

      if (pathCompiler) {
        params = assign({},
          this.props.mergeParams ? currentRoute.params : {},
          this.props.params
        )

        query = qs.stringify(assign({},
          this.props.mergeQuery ? currentRoute.query : null,
          this.props.query
        ))

        attributes.href =
          (pathCompiler(params)) +
          (query ? '?' + query : '')
      } else {
        attributes.href = this.props.to
      }
    }

    if (typeof attributes.href === 'string') {
      if (currentRoute.config.hashbang) {
        attributes.href = '#!' + attributes.href
      }

      if (currentRoute.config.base) {
        attributes.href = currentRoute.config.base + attributes.href
      }
    }

    if (currentRoute.path === attributes.href) {
      if (attributes.className) attributes.className += ' '

      attributes.className += this.props.activeClassName
    }

    return a(attributes, this.props.children)
  }
})
