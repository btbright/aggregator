import path from 'path';
import Express from 'express';
import qs from 'querystring';

import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import constants from '../common/constants/App'

const app = new Express();
const port = 3000;

app.use(Express.static('dist'));
app.use(handleRender);

function handleRender(req, res) {
  const params = qs.parse(req.query);

  const initialState = {};
  const store = configureStore(initialState);

  const html = React.renderToString(
    <Provider store={store}>
      { () => <App/> }
    </Provider>);

  const finalState = store.getState();

  res.send(renderFullPage(html, finalState, constants.React.ROOTELEMENTID));
}

function renderFullPage(html, initialState, reactRootId) {
  return `
    <!doctype html>
    <html class="no-js" lang="">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Aggregators</title>
        <link rel="stylesheet" media="all" href="css/normalize.css" />
        <link rel="stylesheet" media="all" href="css/app.css" />
      </head>
      <body>
        <div id="${reactRootId}">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="scripts/bundle.js"></script>      
      </body>
    </html>
    `;
}

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});