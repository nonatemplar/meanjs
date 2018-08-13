(function () {
  'use strict';

  // Records controller
  angular
    .module('records')
    .controller('RecordsController', RecordsController);

  RecordsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'recordResolve'];

  function RecordsController ($scope, $state, $window, Authentication, record) {
    var vm = this;

    vm.authentication = Authentication;
    vm.record = record;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Record
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.record.$remove($state.go('records.list'));
      }
    }

    // Save Record
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.recordForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.record._id) {
        vm.record.$update(successCallback, errorCallback);
      } else {
        vm.record.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('records.view', {
          recordId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
