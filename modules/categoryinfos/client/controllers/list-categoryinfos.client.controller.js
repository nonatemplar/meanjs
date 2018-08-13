(function () {
  'use strict';

  angular
    .module('categoryinfos')
    .controller('CategoryinfosListController', CategoryinfosListController);

  CategoryinfosListController.$inject = ['CategoryinfosService'];

  function CategoryinfosListController(CategoryinfosService) {
    var vm = this;

    vm.categoryinfos = CategoryinfosService.query();
  }
}());
