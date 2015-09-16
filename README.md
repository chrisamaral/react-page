react-page
==========

minimalist router for react, based on [page.js](https://www.npmjs.com/package/page).

```js

var Login = require('./components/Login');
var Home = require('./components/Home');
var Settings = require('./components/Settings');
var Container = require('./components/Container');
var Profile = require('./components/Profile');
var page = require('react-page');

function render(Root) {

  React.render(<Root />,
    document.getElementById('app');

}

page('/', Container, Home, render);
page('/login', Login, render);
page('/settings', Container, Settings, render);
page('/user/:id/profile', Container, Profile, render);

```
