(function () {
    'use strict';

    var vehicles = [];

    angular.module('search').
    controller('SearchController', ['$rootScope', '$scope', '$location', '$translatePartialLoader', 'SearchService', 'TokenService',
            function ($rootScope, $scope, $location, $translatePartialLoader, searchService, tokenService) {
        function searchSuccess(res) {
            if(res && res.vehicles) { // TODO: verify if it's an array
                $scope.vehicles = res.vehicles;
                vehicles = res.vehicles;
            }
        }

        function searchFailed() {
            $rootScope.error = 'Search failed';
            vehicles = [];
            $scope.vehicles = vehicles;
        }

        $translatePartialLoader.addPart('search');

        $scope.search = function() {
            var formData = {
                type: $scope.type,
                feature1: $scope.feature1
            };
            searchService.search(formData, searchSuccess, searchFailed);
        };

        $scope.advancedSearch = function() {
            if(tokenService.getToken() == null) {
                $rootScope.error = 'Access denied';
                return;
            }
            var formData = {
                type: $scope.type,
                feature1: $scope.feature1,
                feature2: $scope.feature2,
                feature3: $scope.feature3
            };

            searchService.advancedSearch(formData, searchSuccess, searchFailed);
        };
        $scope.viewDetails = function(id) {
            $location.path("/vehicle/" + id);
        };

        $scope.vehicles = vehicles;
    }]);
})();
