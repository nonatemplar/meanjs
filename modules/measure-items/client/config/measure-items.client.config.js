(function () {
  'use strict';

  angular
    .module('measure-items')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Measure items',
      state: 'measure-items',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'measure-items', {
      title: 'List Measure items',
      state: 'measure-items.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'measure-items', {
      title: 'Create Measure item',
      state: 'measure-items.create',
      roles: ['user']
    });
  }
}());
