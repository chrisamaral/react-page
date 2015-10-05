var React = require('react');
var irl = require('../lib');
var assign = require('object-assign');

var createClass = React.createClass;
var createElement = React.createElement;
var createFactory = React.createFactory;

var Link = createFactory(irl.Link);

var DOM = React.DOM;
var h1 = DOM.h1;
var h2 = DOM.h2;
var hr = DOM.hr;
var div = DOM.div;
var aside = DOM.aside;
var em = DOM.em;
var ul = DOM.ul;
var li = DOM.li;
var a = DOM.a;
var button = DOM.button;
var PropTypes = React.PropTypes;

var cType = {
  childComponent: PropTypes.func.isRequired
};

var Raiz = createClass({

  displayName: 'Raiz',
  contextTypes: cType,

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
          ul({className: 'nav nav-pills nav-stacked'},

            [
              {text: 'Sim', href: '/'},
              {text: 'Não', href: '/nao'},
              {text: 'Talvez', href: '/talvez'}
            ].map(function (p, index) {
                var attributes = assign({activeClassName: 'text-uppercase'}, p);
                delete attributes.text;
                return li({key: index},
                  Link(attributes, p.text));
              })
          )
        ),

        div({className: 'col-sm-8'},
          h1(null, 'Topo da árvore ' + this.state.count),
          hr(),
          button({className: 'btn btn-primary', onClick: this.inc}, '+'),
          createElement(this.context.childComponent)
        )
      )
    );

  }

});

var Sim = createClass({

  displayName: 'Sim',
  render: function () {

    return div(null, h2(null, 'Sim, e acabou'));

  }

});

var Nao = createClass({

  displayName: 'Não',
  contextTypes: cType,

  render: function () {

    return div(null, h2(null, 'Não'),
      createElement(this.context.childComponent));

  }

});

var Talvez = createClass({

  displayName: 'Talvez',
  contextTypes: cType,

  render: function () {

    return div(
      null,
      h2(null, 'Talvez'),
      createElement(this.context.childComponent)
    );

  }

});


var ConteMais = createClass({

  displayName: 'ConteMais',
  contextTypes: {
    route: PropTypes.object.isRequired
  },

  render: function () {

    return Link({
      className: 'btn btn-default',
      href: './the-end'
    }, 'e daí');

  }

});

var Edai = createClass({

  displayName: 'Edai',
  render: function () {

    return div({className: 'well'}, 'Ninguém liga');

  }

});

var Loading = createClass({
  displayName: 'Loading',
  render: function () {
    return em(null, 'Loading...');
  }
});

var Ops = createClass({
  displayName: 'Ops!',
  render: function () {
    return em(null, 'Oops!');
  }
});

function render(Root) {
  React.render(createElement(Root), document.getElementById('app'));
}


function inAMin() {

  return new Promise(function (resolve, reject) {
    setTimeout(function () {

      Number(Math.random().toString().slice(-1)) % 3
        ? resolve(true)
        : reject(false);

    }, 3000);
  });

}

irl('/',

  irl.when(inAMin, Raiz, Ops, Loading),

  Sim,

  render
);


Edai = irl.when(inAMin, Edai, Ops, Loading);

irl('/nao', Raiz, Nao, ConteMais, render);
irl('/talvez', Raiz, Talvez, ConteMais, render);
irl('/nao/the-end', Raiz, Nao, Edai, render);
irl('/talvez/the-end', Raiz, Talvez, Edai, render);
irl();
