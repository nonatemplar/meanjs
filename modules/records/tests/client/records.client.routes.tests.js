(function () {
  'use strict';

  describe('Records Route Tests', function () {
    // Initialize global variables
    var $scope,
      RecordsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RecordsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RecordsService = _RecordsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('records');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/records');
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
          RecordsController,
          mockRecord;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('records.view');
          $templateCache.put('modules/records/client/views/view-record.client.view.html', '');

          // create mock Record
          mockRecord = new RecordsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Record Name'
          });

          // Initialize Controller
          RecordsController = $controller('RecordsController as vm', {
            $scope: $scope,
            recordResolve: mockRecord
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:recordId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.recordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            recordId: 1
          })).toEqual('/records/1');
        }));

        it('should attach an Record to the controller scope', function () {
          expect($scope.vm.record._id).toBe(mockRecord._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/records/client/views/view-record.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RecordsController,
          mockRecord;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('records.create');
          $templateCache.put('modules/records/client/views/form-record.client.view.html', '');

          // create mock Record
          mockRecord = new RecordsService();

          // Initialize Controller
          RecordsController = $controller('RecordsController as vm', {
            $scope: $scope,
            recordResolve: mockRecord
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.recordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/records/create');
        }));

        it('should attach an Record to the controller scope', function () {
          expect($scope.vm.record._id).toBe(mockRecord._id);
          expect($scope.vm.record._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/records/client/views/form-record.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RecordsController,
          mockRecord;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('records.edit');
          $templateCache.put('modules/records/client/views/form-record.client.view.html', '');

          // create mock Record
          mockRecord = new RecordsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Record Name'
          });

          // Initialize Controller
          RecordsController = $controller('RecordsController as vm', {
            $scope: $scope,
            recordResolve: mockRecord
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:recordId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.recordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            recordId: 1
          })).toEqual('/records/1/edit');
        }));

        it('should attach an Record to the controller scope', function () {
          expect($scope.vm.record._id).toBe(mockRecord._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/records/client/views/form-record.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
