(function () {
  'use strict';

  angular
    .module('categoryinfos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('categoryinfos', {
        abstract: true,
        url: '/categoryinfos',
        template: '<ui-view/>'
      })
      .state('categoryinfos.list', {
        url: '',
        templateUrl: 'modules/categoryinfos/client/views/list-categoryinfos.client.view.html',
        controller: 'CategoryinfosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categoryinfos List'
        }
      })
      .state('categoryinfos.create', {
        url: '/create',
        templateUrl: 'modules/categoryinfos/client/views/form-categoryinfo.client.view.html',
        controller: 'CategoryinfosController',
        controllerAs: 'vm',
        resolve: {
          categoryinfoResolve: newCategoryinfo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Categoryinfos Create'
        }
      })
      .state('categoryinfos.edit', {
        url: '/:categoryinfoId/edit',
        templateUrl: 'modules/categoryinfos/client/views/form-categoryinfo.client.view.html',
        controller: 'CategoryinfosController',
        controllerAs: 'vm',
        resolve: {
          categoryinfoResolve: getCategoryinfo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Categoryinfo {{ categoryinfoResolve.name }}'
        }
      })
      .state('categoryinfos.view', {
        url: '/:categoryinfoId',
        templateUrl: 'modules/categoryinfos/client/views/view-categoryinfo.client.view.html',
        controller: 'CategoryinfosController',
        controllerAs: 'vm',
        resolve: {
          categoryinfoResolve: getCategoryinfo
        },
        data: {
          pageTitle: 'Categoryinfo {{ categoryinfoResolve.name }}'
        }
      });
  }

  getCategoryinfo.$inject = ['$stateParams', 'CategoryinfosService'];

  function getCategoryinfo($stateParams, CategoryinfosService) {
    return CategoryinfosService.get({
      categoryinfoId: $stateParams.categoryinfoId
    }).$promise;
  }

  newCategoryinfo.$inject = ['CategoryinfosService'];

  function newCategoryinfo(CategoryinfosService) {
    return new CategoryinfosService();
  }
}());
