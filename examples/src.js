var React = require('react');
var irl = require('../index');

var createClass = React.createClass;
var createElement = React.createElement;
var DOM = React.DOM;
var h1 = DOM.h1;
var h2 = DOM.h2;
var hr = DOM.hr;
var div = DOM.div;
var aside = DOM.aside;
var ul = DOM.ul;
var li = DOM.li;
var a = DOM.a;
var button = DOM.button;
var PropTypes = React.PropTypes;

var pages = [
  {text: 'Sim', href: '/'},
  {text: 'Não', href: '/nao'},
  {text: 'Talvez', href: '/talvez'}
].map(function (p, index) {

    return li({key: index},
      a({href: p.href}, p.text));

  });

var cType = {
  getChild: PropTypes.func.isRequired
};

function getChild() {
  return createElement(this.context.getChild());
}

var Sim = createClass({

  displayName: 'Sim',
  contextTypes: cType,
  getChild: getChild,

  getInitialState: function () {
    return {
      count: 1
    };
  },

  inc: function () {

    this.setState({
      count: this.state.count + 1
    });

  },

  render: function () {

    return div({className: 'container'},

      div({className: 'row'},

        aside({className: 'col-sm-4'},
          ul({className: 'nav nav-pills nav-stacked'}, pages)
        ),

        div({className: 'col-sm-8'},
          h1(null, 'Sim ' + this.state.count),
          hr(),
          button({className: 'btn btn-primary', onClick: this.inc}, '+'),
          this.getChild()
        )
      )
    );

  }

});

var Pera = createClass({

  displayName: 'Pera',
  render: function () {

    return div(null, h2(null, 'Pera...'));

  }

});

var Nao = createClass({

  displayName: 'Não',
  contextTypes: cType,
  getChild: getChild,

  render: function () {

    return div(null, h2(null, 'Não'), this.getChild());

  }

});

var Talvez = createClass({

  displayName: 'Talvez',
  contextTypes: cType,
  getChild: getChild,

  render: function () {

    return div(
      null,
      h2(null, 'Talvez'),
      this.getChild()
    );

  }

});


var Nope = createClass({

  displayName: 'Nope',
  contextTypes: {
    route: PropTypes.object.isRequired
  },

  render: function () {

    return a({
      className: 'btn btn-default',
      href: this.context.route.pathname + '/the-end'
    }, 'e daí');

  }

});

var Edai = createClass({

  displayName: 'Edai',
  render: function () {

    return div({className: 'well'}, 'Ninguém liga');

  }

});

function render(el) {
  React.render(el, document.getElementById('app'));
}

irl('/', Sim, Pera, render);
irl('/nao', Sim, Nao, Nope, render);
irl('/talvez', Sim, Talvez, Nope, render);
irl('/nao/the-end', Sim, Nao, Edai, render);
irl('/talvez/the-end', Sim, Talvez, Edai, render);
irl();
