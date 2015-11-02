import path from 'path';
import Express from 'express';
import socketio from 'socket.io';
import qs from 'querystring';
import http from 'http';
import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../common/store/configureStore';
import App from '../common/containers/app';
import TwitchApp from '../common/containers/app';
import constants from '../common/constants/App'
import ChatAPI from './API/chat'
import RoomAPI from './API/room'
import AggregatorAPI from './API/aggregator'

import { EventEmitter } from 'events'

const app = new Express();
const port = 80;

var server = http.Server(app);

var io = socketio(server);

app.use(Express.static('public'));
app.use('/r/:id',handleRender);
app.use('/t/:type/:streamer',handleTwitchRender);

var messenger = new EventEmitter();

ChatAPI(io)
RoomAPI(io, messenger)
AggregatorAPI(io, messenger)

server.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});

var roomTypes = {
  standard : {},
  twitch : {},
  agario : {
    permagators : ['lol', 'rekt', 'rip', 'sp!itki!!']
  }
}

let roomStatus = {};
messenger.on('room:isOpen:change', (roomName, isOpen) => {
  roomStatus[roomName] = isOpen;
});

const allowedGameTypes = ['agario'];
const allowedStreamers = ['test'];

function handleTwitchRender(req, res){
  const requestedGameType = req.params.type;
  const requestedStreamer = req.params.streamer;

  if (!allowedGameTypes.includes(requestedGameType)){
    res.send(`<html><head></head><body><h1>Sorry, ${requestedGameType} games aren't ready yet. Coming soon...</h1></body></html>`);
    return;
  }

  if (!allowedStreamers.includes(requestedStreamer)){
    res.send(`<html><head></head><body><h1>Sorry, we haven't created a game for ${requestedStreamer}, yet. Coming soon...</h1></body></html>`);
    return;
  }

  const initialState = {
    room : {
      name : requestedStreamer,
      twitch : true,
      twitchChannel : requestedStreamer
    }
  };

  const store = configureStore(initialState);

  const html = React.renderToString(
    <Provider store={store}>
      { () => <TwitchApp/> }
    </Provider>);

  const finalState = store.getState();

  res.send(renderFullPage(html, finalState, constants.React.ROOTELEMENTID, requestedStreamer, 'twitchRoot'));
}

function handleRender(req, res) {
  const requestedRoomName = req.params.id;
  const initialState = {
    room : {
      name : requestedRoomName
    }
  };

  //if the room is closed, don't let em in
  if (typeof roomStatus[requestedRoomName] !== 'undefined' && roomStatus[requestedRoomName] === false){
    res.send(`<html><head></head><body><h1>Sorry, the game for ${requestedRoomName} is full.</h1></body></html>`);
    return;
  }

  const store = configureStore(initialState);

  const html = React.renderToString(
    <Provider store={store}>
      { () => <App/> }
    </Provider>);

  const finalState = store.getState();

  res.send(renderFullPage(html, finalState, constants.React.ROOTELEMENTID, requestedRoomName, 'standardRoot'));
}

function renderFullPage(html, initialState, reactRootId, roomName, bundleName) {
  return `
    <!doctype html>
    <html class="no-js" lang="">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>${roomName}</title>
        <link href='https://fonts.googleapis.com/css?family=Poppins:500' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" media="all" href="/css/normalize.css" />
        <link rel="stylesheet" media="all" href="/css/app.css" />
      </head>
      <body>
        <div id="${reactRootId}">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
        <script src="/socket.io/socket.io.js"></script>
        <script src="/scripts/${bundleName}.js"></script>      
      </body>
    </html>
    `;
}