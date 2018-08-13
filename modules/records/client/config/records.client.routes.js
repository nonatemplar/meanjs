(function () {
  'use strict';

  angular
    .module('records')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('records', {
        abstract: true,
        url: '/records',
        template: '<ui-view/>'
      })
      .state('records.list', {
        url: '',
        templateUrl: 'modules/records/client/views/list-records.client.view.html',
        controller: 'RecordsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Records List'
        }
      })
      .state('records.create', {
        url: '/create',
        templateUrl: 'modules/records/client/views/form-record.client.view.html',
        controller: 'RecordsController',
        controllerAs: 'vm',
        resolve: {
          recordResolve: newRecord
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Records Create'
        }
      })
      .state('records.edit', {
        url: '/:recordId/edit',
        templateUrl: 'modules/records/client/views/form-record.client.view.html',
        controller: 'RecordsController',
        controllerAs: 'vm',
        resolve: {
          recordResolve: getRecord
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Record {{ recordResolve.name }}'
        }
      })
      .state('records.view', {
        url: '/:recordId',
        templateUrl: 'modules/records/client/views/view-record.client.view.html',
        controller: 'RecordsController',
        controllerAs: 'vm',
        resolve: {
          recordResolve: getRecord
        },
        data: {
          pageTitle: 'Record {{ recordResolve.name }}'
        }
      });
  }

  getRecord.$inject = ['$stateParams', 'RecordsService'];

  function getRecord($stateParams, RecordsService) {
    return RecordsService.get({
      recordId: $stateParams.recordId
    }).$promise;
  }

  newRecord.$inject = ['RecordsService'];

  function newRecord(RecordsService) {
    return new RecordsService();
  }
}());
