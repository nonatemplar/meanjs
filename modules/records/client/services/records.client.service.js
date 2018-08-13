// Records service used to communicate Records REST endpoints
(function () {
  'use strict';

  angular
    .module('records')
    .factory('RecordsService', RecordsService);

  RecordsService.$inject = ['$resource'];

  function RecordsService($resource) {
    return $resource('api/records/:recordId', {
      recordId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
