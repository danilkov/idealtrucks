(function () {
    'use strict';

    angular.module('vehicles', []).
    factory('Vehicle', ['$resource', 'urls', function($resource, urls) {
        return $resource(urls.BASE_API + '/vehicle/:vehicleId/:action', {
            vehicleId: "@vehicleId",
            action: "@action"
        }, {
            preview: {
                method: "GET",
                params: {
                    action: "preview"
                }
            }
        });
    }]).
    service('VehiclesService', ['$http', 'Vehicle', function ($http, Vehicle) {
        this.get = function(vechicleId, success, error) {
            var vehicle = Vehicle.get({vehicleId: vechicleId},
                function() {
                    success(vehicle);
                }, error);
        };

        this.preview = function(vechicleId, success, error) {
            var vehicle = Vehicle.preview({vehicleId: vechicleId},
                function() {
                    success(vehicle);
                }, error);
        };
        // TODO: implement the rest
    }]);
})();
