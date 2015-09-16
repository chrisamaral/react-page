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

var Sim = createClass({

  contextTypes: cType,

  render: function () {

    var Child = this.context.getChild();

    return div({className: 'container'},

      div({className: 'row'},

        aside({className: 'col-sm-4'},
          ul({className: 'nav nav-pills nav-stacked'}, pages)
        ),

        div({className: 'col-sm-8'},
          h1(null, 'Sim'),
          hr(),
          createElement(Child)
        )
      )
    );

  }

});

var Pera = createClass({

  render: function () {

    return div(null, h2(null, 'Pera...'));

  }

});

var Nao = createClass({

  contextTypes: cType,

  render: function () {

    var Child = this.context.getChild();

    return div(null, h2(null, 'Não'), createElement(Child));

  }

});

var Talvez = createClass({

  contextTypes: cType,

  render: function () {

    var Child = this.context.getChild();

    return div(null, h2(null, 'Talvez'), createElement(Child));

  }

});

var Nope = createClass({

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

  render: function () {

    return div({className: 'well'}, 'Ninguém liga');

  }

});

function render(Elem) {
  React.render(
    createElement(Elem),
    document.getElementById('app')
  );
}

irl('/', Sim, Pera, render);
irl('/nao', Sim, Nao, Nope, render);
irl('/talvez', Sim, Talvez, Nope, render);
irl('/nao/the-end', Sim, Nao, Edai, render);
irl('/talvez/the-end', Sim, Talvez, Edai, render);
irl();
