var React = require('react');
var qs = require('qs');
var createClass = React.createClass;
var PropTypes = React.PropTypes;
var a = React.DOM.a;

module.exports = createClass({
  displayName: 'Link',

  getDefaultProps: function () {

    return {
      activeClassName: 'active',
      className: ''
    };

  },

  contextTypes: {

    route: PropTypes.object.isRequired,
    getPathFor: PropTypes.func.isRequired

  },

  propTypes: {

    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    href: PropTypes.string,

    to: PropTypes.string,
    params: PropTypes.object,
    query: PropTypes.object,
    activeClassName: PropTypes.string,
    noMerge: PropTypes.bool

  },

  render: function () {

    var attributes = {
      className: this.props.className,
      href: this.props.href
    };

    var currentRoute = this.context.route;
    var params, query, pathCompiler;
    var noMerge = this.props.noMerge;

    if (typeof attributes.href === 'string') {
      attributes.href = attributes.href.replace(/^\.\//g, currentRoute.pathname + '/');
    }

    if (attributes.href === undefined) {

      pathCompiler = this.context.getPathFor(this.props.to);

      params = assign({},
        noMerge ? null : currentRoute.params,
        this.props.params
      );

      query = qs.stringify(assign({},
        noMerge ? null : currentRoute.query,
        this.props.query
      ));

      attributes.href = pathCompiler(params) +
        (query ? '?' + query : '');

    }

    if (currentRoute.path === attributes.href) {
      attributes.className += this.props.activeClassName;
    }

    return a(attributes, this.props.children);
  }
});
