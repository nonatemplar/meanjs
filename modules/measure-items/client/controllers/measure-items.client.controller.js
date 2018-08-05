(function () {
  'use strict';

  // Measure items controller
  angular
    .module('measure-items')
    .controller('MeasureItemsController', MeasureItemsController);

  MeasureItemsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'measureItemResolve'];

  function MeasureItemsController ($scope, $state, $window, Authentication, measureItem) {
    var vm = this;

    vm.authentication = Authentication;
    vm.measureItem = measureItem;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Measure item
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.measureItem.$remove($state.go('measure-items.list'));
      }
    }

    // Save Measure item
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.measureItemForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.measureItem._id) {
        vm.measureItem.$update(successCallback, errorCallback);
      } else {
        vm.measureItem.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('measure-items.view', {
          measureItemId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
