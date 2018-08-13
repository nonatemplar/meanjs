// Categoryinfos service used to communicate Categoryinfos REST endpoints
(function () {
  'use strict';

  angular
    .module('categoryinfos')
    .factory('CategoryinfosService', CategoryinfosService);

  CategoryinfosService.$inject = ['$resource'];

  function CategoryinfosService($resource) {
    return $resource('api/categoryinfos/:categoryinfoId', {
      categoryinfoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
