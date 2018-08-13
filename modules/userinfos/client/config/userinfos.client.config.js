(function () {
  'use strict';

  angular
    .module('userinfos')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'User Info',
      state: 'userinfos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'userinfos', {
      title: 'List Userinfos',
      state: 'userinfos.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'userinfos', {
      title: 'Create Userinfo',
      state: 'userinfos.create',
      roles: ['user']
    });
  }
}());
