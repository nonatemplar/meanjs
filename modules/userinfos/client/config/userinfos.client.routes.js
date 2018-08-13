(function () {
  'use strict';

  angular
    .module('userinfos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userinfos', {
        abstract: true,
        url: '/userinfos',
        template: '<ui-view/>'
      })
      .state('userinfos.list', {
        url: '',
        templateUrl: 'modules/userinfos/client/views/list-userinfos.client.view.html',
        controller: 'UserinfosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userinfos List'
        }
      })
      .state('userinfos.create', {
        url: '/create',
        templateUrl: 'modules/userinfos/client/views/form-userinfo.client.view.html',
        controller: 'UserinfosController',
        controllerAs: 'vm',
        resolve: {
          userinfoResolve: newUserinfo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Userinfos Create'
        }
      })
      .state('userinfos.edit', {
        url: '/:userinfoId/edit',
        templateUrl: 'modules/userinfos/client/views/form-userinfo.client.view.html',
        controller: 'UserinfosController',
        controllerAs: 'vm',
        resolve: {
          userinfoResolve: getUserinfo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Userinfo {{ userinfoResolve.name }}'
        }
      })
      .state('userinfos.view', {
        url: '/:userinfoId',
        templateUrl: 'modules/userinfos/client/views/view-userinfo.client.view.html',
        controller: 'UserinfosController',
        controllerAs: 'vm',
        resolve: {
          userinfoResolve: getUserinfo
        },
        data: {
          pageTitle: 'Userinfo {{ userinfoResolve.name }}'
        }
      });
  }

  getUserinfo.$inject = ['$stateParams', 'UserinfosService'];

  function getUserinfo($stateParams, UserinfosService) {
    return UserinfosService.get({
      userinfoId: $stateParams.userinfoId
    }).$promise;
  }

  newUserinfo.$inject = ['UserinfosService'];

  function newUserinfo(UserinfosService) {
    return new UserinfosService();
  }
}());
