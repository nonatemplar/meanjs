(function () {
  'use strict';

  angular
    .module('records')
    .controller('RecordsListController', RecordsListController);

  RecordsListController.$inject = ['RecordsService'];

  function RecordsListController(RecordsService) {
    var vm = this;

    vm.records = RecordsService.query();
  }
}());
