(function () {
    'use strict';

    var vehicles = [];

    angular.module('search').
    controller('SearchController', ['$rootScope', '$scope', '$location', '$translatePartialLoader', 'SearchService', 'TokenService',
            function ($rootScope, $scope, $location, $translatePartialLoader, searchService, tokenService) {
        function searchSuccess(res) {
            if(res && res.vehicles) { // TODO: verify if it's an array
                setVehicles(res.vehicles);
            }
            else {
                setVehicles([]);
            }
        }

        function setVehicles($vehicles) {
            vehicles = $vehicles;
            $scope.vehicles = $vehicles;
            if(vehicles.length > 0) {
                $scope.isPanelExpanded = false;
            }
            else {
                $scope.isPanelExpanded = true;
            }
        }

        function searchFailed() {
            $rootScope.error = 'Search failed';
            setVehicles([]);
        }

        $translatePartialLoader.addPart('search');

        $scope.search = function() {
            $scope.isAdvancedSearch = false;

            var formData = {
                type: $scope.type,
                feature1: $scope.feature1
            };
            searchService.search(formData, searchSuccess, searchFailed);
        };

        $scope.advancedSearch = function() {
            if(tokenService.getToken() == null) {
                $rootScope.error = 'Access denied';
                $scope.isAdvancedSearch = false;
                return;
            }
            $scope.isAdvancedSearch = true;
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

        $scope.select = function($tab) {
            if('advanced' === $tab && tokenService.getToken() != null) {
                $scope.isAdvancedSearch = true;
            }
            else {
                $scope.isAdvancedSearch = false;
            }
            $scope.isPanelExpanded = true;
        };

        setVehicles(vehicles);
        $scope.isAdvancedSearch = false;
    }]);
})();
