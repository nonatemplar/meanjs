(function () {
  'use strict';

  angular
    .module('measure-items')
    .controller('MeasureItemsListController', MeasureItemsListController);

  MeasureItemsListController.$inject = ['MeasureItemsService'];

  function MeasureItemsListController(MeasureItemsService) {
    var vm = this;

    vm.measureItems = MeasureItemsService.query();
  }
}());
