(function () {
  'use strict';

  angular
    .module('game')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Game',
      state: 'game'
    });
  }
}());
