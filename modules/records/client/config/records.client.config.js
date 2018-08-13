(function () {
  'use strict';

  angular
    .module('records')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Measure Records',
      state: 'records',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'records', {
      title: 'List Records',
      state: 'records.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'records', {
      title: 'Create Record',
      state: 'records.create',
      roles: ['user']
    });
  }
}());
