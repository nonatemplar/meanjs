(function () {
  'use strict';

  angular
    .module('userinfos')
    .controller('UserinfosListController', UserinfosListController);

  UserinfosListController.$inject = ['UserinfosService'];

  function UserinfosListController(UserinfosService) {
    var vm = this;

    vm.userinfos = UserinfosService.query();
  }
}());
