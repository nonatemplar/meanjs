(function () {
  'use strict';

  angular
    .module('categoryinfos')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Measure Categories',
      state: 'categoryinfos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'categoryinfos', {
      title: 'List Categories',
      state: 'categoryinfos.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'categoryinfos', {
      title: 'Create Category',
      state: 'categoryinfos.create',
      roles: ['user']
    });
  }
}());
