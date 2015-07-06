(function () {
    'use strict';
    angular.module('truxApp', [
        'ngRoute', 'ngResource',
        'angular-loading-bar',
        'pascalprecht.translate',
	'polyglotLanguageSwitcher',
        'directives.passwordStrength',
        'directives.confirmPassword',
        'auth',
        'search',
        'vehicles'
    ]).
    constant('urls', {
        BASE: '',
        BASE_API: '/api/v1'
    }).
    config(['$routeProvider', '$httpProvider', '$locationProvider', '$translateProvider', '$translatePartialLoaderProvider',
            function ($routeProvider, $httpProvider, $locationProvider, $translateProvider, $translatePartialLoaderProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'modules/search/search.html',
                controller: 'SearchController'
            }).
            when('/signin', {
                templateUrl: 'modules/auth/signin.html',
                controller: 'AuthController'
            }).
            when('/signup', {
                templateUrl: 'modules/auth/signup.html',
                controller: 'AuthController'
            }).
            when('/vehicle/:id', {
                templateUrl: 'modules/vehicles/details.html',
                controller: 'VehiclesController'
            }).
            when('/account', {
                restricted: true,
                templateUrl: 'modules/account/account.html',
                controller: 'AuthController'  // FIXME: use the account controller
            }).
            otherwise({
                redirectTo: '/'
            });
        $httpProvider.interceptors.push(['$q', '$location', '$rootScope', 'TokenService', function ($q, $location, $rootScope, tokenService) {
            function extractToken(response) {
                var token = response.headers('X-JWT-Token');
                if(token) {
                    tokenService.setToken(token);
                }
            }

            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    var token = tokenService.getToken();
                    if (token != null) {
                        config.headers.Authorization = 'Bearer ' + token;
                    }
                    return config;
                },
                'response': function (response) {
                    if(response.status === 200) {
                        extractToken(response);
                    }
                    return response;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        tokenService.setToken(null);
                        $rootScope.returnTo = $location.path();
                        $location.path('/signin');
                    }
                    else {
                        extractToken(response);
                    }
                    return $q.reject(response);
                }
            }
        }]);

        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-Token';
        $httpProvider.defaults.xsrfCookieName = 'csrfToken';

        $locationProvider.html5Mode(true);

        $translateProvider
            .useLoader('$translatePartialLoader', {
                urlTemplate: '/modules/{part}/locale/{lang}.json'
            })
            //.translations('de', { /* ... */ })
            //.translations('ru', { /* ... */ })
            //.translations('lt', { /* ... */ })
            //.translations('en', { /* ... */ })
            .registerAvailableLanguageKeys(['en', 'de', 'ru', 'lt'], {
                'en_US': 'en',
                'en_UK': 'en',
                'de_DE': 'de',
                'de_CH': 'de',
                'ru_RU': 'ru',
                'lt_LT': 'lt'
            })
            .fallbackLanguage('en')
            .determinePreferredLanguage()
            .useSanitizeValueStrategy('escaped')
            /*.useLocalStorage()*/;

            $translatePartialLoaderProvider.addPart('auth');
            $translatePartialLoaderProvider.addPart('search');
    }]).
    controller('TranslateController', ['$translate', '$scope', function($translate, $scope) {
        if(localStorage.langKey) {
            $translate.use(localStorage.langKey);
            $scope.currentLanguage = localStorage.langKey;
        }
        else {
            $scope.currentLanguage = $translate.use();
        }

        $scope.languages = [
            {id: 'de', label: "Deutsch"},
            {id: 'ru', label: "Русский"},
            {id: 'lt', label: "Lietuvių"},
            {id: 'en', label: "English"}];

        $scope.changeLanguage = function () {
            $translate.use($scope.currentLanguage);
            localStorage.langKey = $scope.currentLanguage;
        };

	$scope.$on('pls.onLanguageChanged', function(evt, lang){
            if (lang && lang.lang && lang.lang.id) {
                $scope.currentLanguage = lang.lang.id;
                $translate.use($scope.currentLanguage);
                localStorage.langKey = $scope.currentLanguage;
            }
        });
	$scope.plsModel = {
            languages: [
                {id: 'de', title: 'Deutsch', name: ' Deutsch', flagImg: 'img/de.png', flagTitle: 'Deutschland'},
                {id: 'ru', title: 'Русский', name: 'Русский', flagImg: 'img/ru.png', flagTitle: 'Россия'},
                {id: 'lt', title: 'Lietuvių', name: 'Lietuvių', flagImg: 'img/lt.png', flagTitle: 'Lietuva'},
                {id: 'en', title: 'English (UK)', name: ' English (UK)', flagImg: 'img/gb.png', flagTitle: 'United Kingdom'},

            ]
        };
    }]).
    run(['$rootScope', '$location', '$translate', 'TokenService',
            function($rootScope, $location, $translate, tokenService) {
        $rootScope.$on( "$routeChangeStart", function(event, next) {
            delete $rootScope.error;
            if (tokenService.getToken() == null) {
                if (next && next.restricted === true) {
                    $rootScope.returnTo = $location.path();
                    $location.path("/signin");
                }
                else if($rootScope.returnTo) {
                    delete $rootScope.returnTo;
                }
            }
        });

        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });

        tokenService.setToken(localStorage.token);
    }]);
})();
