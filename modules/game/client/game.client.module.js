(function (app) {
  'use strict';

  app.registerModule('game', ['core']);
  app.registerModule('game.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
