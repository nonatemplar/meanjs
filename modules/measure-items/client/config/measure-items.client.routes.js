(function () {
  'use strict';

  angular
    .module('measure-items')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('measure-items', {
        abstract: true,
        url: '/measure-items',
        template: '<ui-view/>'
      })
      .state('measure-items.list', {
        url: '',
        templateUrl: 'modules/measure-items/client/views/list-measure-items.client.view.html',
        controller: 'MeasureItemsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Measure items List'
        }
      })
      .state('measure-items.create', {
        url: '/create',
        templateUrl: 'modules/measure-items/client/views/form-measure-item.client.view.html',
        controller: 'MeasureItemsController',
        controllerAs: 'vm',
        resolve: {
          measure-itemResolve: newMeasureItem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Measure items Create'
        }
      })
      .state('measure-items.edit', {
        url: '/:measureItemId/edit',
        templateUrl: 'modules/measure-items/client/views/form-measure-item.client.view.html',
        controller: 'MeasureItemsController',
        controllerAs: 'vm',
        resolve: {
          measure-itemResolve: getMeasureItem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Measure item {{ measure-itemResolve.name }}'
        }
      })
      .state('measure-items.view', {
        url: '/:measureItemId',
        templateUrl: 'modules/measure-items/client/views/view-measure-item.client.view.html',
        controller: 'MeasureItemsController',
        controllerAs: 'vm',
        resolve: {
          measure-itemResolve: getMeasureItem
        },
        data: {
          pageTitle: 'Measure item {{ measure-itemResolve.name }}'
        }
      });
  }

  getMeasureItem.$inject = ['$stateParams', 'MeasureItemsService'];

  function getMeasureItem($stateParams, MeasureItemsService) {
    return MeasureItemsService.get({
      measureItemId: $stateParams.measureItemId
    }).$promise;
  }

  newMeasureItem.$inject = ['MeasureItemsService'];

  function newMeasureItem(MeasureItemsService) {
    return new MeasureItemsService();
  }
}());
