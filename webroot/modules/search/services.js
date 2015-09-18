(function () {
    'use strict';

    angular.module('search', []).
    service('SearchService', ['$http', 'urls', function ($http, urls) {
        this.search = function(data, success, error) {
            $http.post(urls.BASE_API + '/search', data).success(success).error(error);
        };
        this.advancedSearch = function(data, success, error) {
            $http.post(urls.BASE_API + '/search/advanced', data).success(success).error(error);
        };
    }]);
})();
