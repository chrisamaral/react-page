react-page
=========

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

minimalist router for react, based on [page.js](https://www.npmjs.com/package/page).

```js

var React = require('react')
var page = require('react-page')

var Loading = require('./components/Loading')
var Login = require('./components/Login')
var LandingPage = require('./components/LandingPage')
var Settings = require('./components/Settings')
var Profile = require('./components/Profile')

var DOM = React.DOM

var header = DOM.header.bind(null, null)
var h1 = DOM.h1.bind(null, null)
var section = DOM.section.bind(null, null)
var p = DOM.p.bind(null, null)
var blockquote = DOM.blockquote.bind(null, null)

var el = React.createElement
var types = React.PropTypes

var Container = React.createClass({
  contextTypes: {
    route: types.object.isRequired,
    childComponent: types.func.isRequired
  },

  render: function () {
    return section(

      header(
        h1('Your Stupid Brand ™')
      ),

      blockquote(

        p('please remember this path "' +
          this.context.route.pathname +
          '", forever'
        )

      ),

      el(this.context.childComponent)
    )
  }
})

function render (Root) {
  React.render(el(Root), document.getElementById('app'))
}

page('/', Container, LandingPage, render)

page('/login', Login, render)

page(
  '/settings',
  Container,
  page.when(isLoggedIn, Settings, Login),
  render
)

var loadUserData = require('./api/user').load

page(
  '/user/:id/profile',
  Container,
  page.when(loadUserData, Profile, ErrorPage, Loading),
  render
)
```
