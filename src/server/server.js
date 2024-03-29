const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 80; // default http port is 80
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.SHIPTURNRIGHT, handleShipTurnRight);
  socket.on(Constants.MSG_TYPES.SHIPTURNLEFT, handleShipTurnLeft);
  socket.on(Constants.MSG_TYPES.CAMTURNRIGHT, handleCamTurnRight);
  socket.on(Constants.MSG_TYPES.CAMTURNLEFT, handleCamTurnLeft);
  socket.on(Constants.MSG_TYPES.SHIPFIRECANNON, handleShipFireCannon);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();

function joinGame(username) {
  if (Object.keys(game.players).length < 10) {
    game.addPlayer(this, username);
  }
}

function handleShipTurnRight(bool) {
  game.shipTurnRight(this, bool);
}

function handleShipTurnLeft(bool) {
  game.shipTurnLeft(this, bool);
}

function handleCameraUpdate(pos) {
  game.updateCamera(this, pos);
}

function handleShipFireCannon() {
  game.shipFireCannon(this);
}

function handleCamTurnRight(bool) {
  game.camTurnRight(this, bool);
}

function handleCamTurnLeft(bool) {
  game.camTurnLeft(this, bool);
}

function onDisconnect() {
  game.removePlayer(this);
}
