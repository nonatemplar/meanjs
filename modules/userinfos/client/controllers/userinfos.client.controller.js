(function () {
  'use strict';

  // Userinfos controller
  angular
    .module('userinfos')
    .controller('UserinfosController', UserinfosController);

  UserinfosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userinfoResolve'];

  function UserinfosController ($scope, $state, $window, Authentication, userinfo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userinfo = userinfo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Userinfo
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.userinfo.$remove($state.go('userinfos.list'));
      }
    }

    // Save Userinfo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userinfoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.userinfo._id) {
        vm.userinfo.$update(successCallback, errorCallback);
      } else {
        vm.userinfo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('userinfos.view', {
          userinfoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
