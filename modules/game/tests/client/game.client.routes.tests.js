(function () {
  'use strict';

  describe('Game Route Tests', function () {
    // Initialize global variables
    var $scope,
      Authentication,
      $httpBackend;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Authentication_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Authentication = _Authentication_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('game');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/game');
        });

        it('Should not be abstract', function () {
          expect(mainstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(mainstate.templateUrl).toBe('/modules/game/client/views/game.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, _$httpBackend_, _Authentication_) {
          Authentication.user = {
            name: 'user',
            roles: ['user']
          };

          $httpBackend = _$httpBackend_;

          // Ignore parent template get on state transition
          $httpBackend.whenGET('/modules/game/client/views/game.client.view.html').respond(200);
          $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

          $state.go('game');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope, $templateCache) {
          $templateCache.put('/modules/game/client/views/game.client.view.html', '');

          $location.path('game/');
          $rootScope.$digest();

          expect($location.path()).toBe('/game');
          expect($state.current.templateUrl).toBe('/modules/game/client/views/game.client.view.html');
        }));
      });

    });
  });
}());
