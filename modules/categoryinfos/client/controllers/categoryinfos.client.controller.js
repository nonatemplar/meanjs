(function () {
  'use strict';

  // Categoryinfos controller
  angular
    .module('categoryinfos')
    .controller('CategoryinfosController', CategoryinfosController);

  CategoryinfosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'categoryinfoResolve'];

  function CategoryinfosController ($scope, $state, $window, Authentication, categoryinfo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.categoryinfo = categoryinfo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Categoryinfo
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.categoryinfo.$remove($state.go('categoryinfos.list'));
      }
    }

    // Save Categoryinfo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categoryinfoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.categoryinfo._id) {
        vm.categoryinfo.$update(successCallback, errorCallback);
      } else {
        vm.categoryinfo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('categoryinfos.view', {
          categoryinfoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
