(function () {
  'use strict';

  angular
    .module('game.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('game', {
        url: '/game',
        templateUrl: '/modules/game/client/views/game.client.view.html',
        controller: 'GameController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Game'
        }
      });
  }
}());
