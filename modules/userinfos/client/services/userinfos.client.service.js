// Userinfos service used to communicate Userinfos REST endpoints
(function () {
  'use strict';

  angular
    .module('userinfos')
    .factory('UserinfosService', UserinfosService);

  UserinfosService.$inject = ['$resource'];

  function UserinfosService($resource) {
    return $resource('api/userinfos/:userinfoId', {
      userinfoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
