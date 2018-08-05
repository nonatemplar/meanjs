(function () {
  'use strict';

  describe('Measure items Route Tests', function () {
    // Initialize global variables
    var $scope,
      MeasureItemsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MeasureItemsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MeasureItemsService = _MeasureItemsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('measure-items');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/measure-items');
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
          MeasureItemsController,
          mockMeasureItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('measure-items.view');
          $templateCache.put('modules/measure-items/client/views/view-measure-item.client.view.html', '');

          // create mock Measure item
          mockMeasureItem = new MeasureItemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Measure item Name'
          });

          // Initialize Controller
          MeasureItemsController = $controller('MeasureItemsController as vm', {
            $scope: $scope,
            measureItemResolve: mockMeasureItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:measureItemId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.measureItemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            measureItemId: 1
          })).toEqual('/measure-items/1');
        }));

        it('should attach an Measure item to the controller scope', function () {
          expect($scope.vm.measureItem._id).toBe(mockMeasureItem._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/measure-items/client/views/view-measure-item.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MeasureItemsController,
          mockMeasureItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('measure-items.create');
          $templateCache.put('modules/measure-items/client/views/form-measure-item.client.view.html', '');

          // create mock Measure item
          mockMeasureItem = new MeasureItemsService();

          // Initialize Controller
          MeasureItemsController = $controller('MeasureItemsController as vm', {
            $scope: $scope,
            measureItemResolve: mockMeasureItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.measureItemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/measure-items/create');
        }));

        it('should attach an Measure item to the controller scope', function () {
          expect($scope.vm.measureItem._id).toBe(mockMeasureItem._id);
          expect($scope.vm.measureItem._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/measure-items/client/views/form-measure-item.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MeasureItemsController,
          mockMeasureItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('measure-items.edit');
          $templateCache.put('modules/measure-items/client/views/form-measure-item.client.view.html', '');

          // create mock Measure item
          mockMeasureItem = new MeasureItemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Measure item Name'
          });

          // Initialize Controller
          MeasureItemsController = $controller('MeasureItemsController as vm', {
            $scope: $scope,
            measureItemResolve: mockMeasureItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:measureItemId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.measureItemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            measureItemId: 1
          })).toEqual('/measure-items/1/edit');
        }));

        it('should attach an Measure item to the controller scope', function () {
          expect($scope.vm.measureItem._id).toBe(mockMeasureItem._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/measure-items/client/views/form-measureItem.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
