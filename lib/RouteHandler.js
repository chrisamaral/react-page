var React = require('react');
var createElement = React.createElement;
var createClass = React.createClass;
var PropTypes = React.PropTypes;

module.exports = createClass({

  displayName: 'Lazy',

  contextTypes: {
    childComponent: PropTypes.func.isRequired
  },

  render: function () {

    return createElement(
      this.context.childComponent,
      this.props,
      this.props.children
    );

  }

});
