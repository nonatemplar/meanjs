// Measure items service used to communicate Measure items REST endpoints
(function () {
  'use strict';

  angular
    .module('measure-items')
    .factory('MeasureItemsService', MeasureItemsService);

  MeasureItemsService.$inject = ['$resource'];

  function MeasureItemsService($resource) {
    return $resource('api/measure-items/:measureItemId', {
      measureItemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
