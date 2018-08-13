(function () {
  'use strict';

  describe('Userinfos Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserinfosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserinfosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserinfosService = _UserinfosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userinfos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userinfos');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserinfosController,
          mockUserinfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userinfos.view');
          $templateCache.put('modules/userinfos/client/views/view-userinfo.client.view.html', '');

          // create mock Userinfo
          mockUserinfo = new UserinfosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userinfo Name'
          });

          // Initialize Controller
          UserinfosController = $controller('UserinfosController as vm', {
            $scope: $scope,
            userinfoResolve: mockUserinfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userinfoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userinfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userinfoId: 1
          })).toEqual('/userinfos/1');
        }));

        it('should attach an Userinfo to the controller scope', function () {
          expect($scope.vm.userinfo._id).toBe(mockUserinfo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userinfos/client/views/view-userinfo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserinfosController,
          mockUserinfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('userinfos.create');
          $templateCache.put('modules/userinfos/client/views/form-userinfo.client.view.html', '');

          // create mock Userinfo
          mockUserinfo = new UserinfosService();

          // Initialize Controller
          UserinfosController = $controller('UserinfosController as vm', {
            $scope: $scope,
            userinfoResolve: mockUserinfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userinfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/userinfos/create');
        }));

        it('should attach an Userinfo to the controller scope', function () {
          expect($scope.vm.userinfo._id).toBe(mockUserinfo._id);
          expect($scope.vm.userinfo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/userinfos/client/views/form-userinfo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserinfosController,
          mockUserinfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('userinfos.edit');
          $templateCache.put('modules/userinfos/client/views/form-userinfo.client.view.html', '');

          // create mock Userinfo
          mockUserinfo = new UserinfosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userinfo Name'
          });

          // Initialize Controller
          UserinfosController = $controller('UserinfosController as vm', {
            $scope: $scope,
            userinfoResolve: mockUserinfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userinfoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userinfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userinfoId: 1
          })).toEqual('/userinfos/1/edit');
        }));

        it('should attach an Userinfo to the controller scope', function () {
          expect($scope.vm.userinfo._id).toBe(mockUserinfo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/userinfos/client/views/form-userinfo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
