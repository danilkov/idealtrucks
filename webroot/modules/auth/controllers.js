(function () {
    'use strict';

    angular.module('auth').
    controller('AuthController',
            ['$rootScope', '$scope', '$location', '$translatePartialLoader', '$interval', 'TokenService', 'AuthService',
            function ($rootScope, $scope, $location, $translatePartialLoader, $interval, tokenService, authService) {
        function successAuth(res) {
            if($rootScope.returnTo) {
                $location.path($rootScope.returnTo);
            }
            else {
                $location.path("/");
            }
        }

        function successLogout() {
//             window.location = "/";
            tokenService.setToken(null);
            $location.path("/");
        }

        function refreshToken() {
            if (tokenService.needsRefresh(60000)) {
                var token = tokenService.getToken();
                if (token) {
                    authService.refresh(function (res) {
                        //tokenService.setToken(res.token);
                    }, function () {
                        tokenService.setToken(null);
                    });
                }
            }
        }

        if(!$rootScope.tokenRefreshPromise) { // FIXME: Looks like it's not firing when the browser is minimized, try setInterval
            $rootScope.tokenRefreshPromise = $interval(refreshToken, 30000); // verify the token every 30 seconds
        }

        $translatePartialLoader.addPart('auth');

/*
        $scope.$on('$destroy', function() {
            if($rootScope.tokenRefreshPromise) {
                $interval.cancel($rootScope.tokenRefreshPromise);
                delete $rootScope.tokenRefreshPromise;
            }
        });
*/

        $scope.signin = function (isValid) {
            if(isValid) {
                var formData = {
                    email: $scope.email,
                    password: $scope.password
                };

                authService.signin(formData, successAuth, function () {
                    $rootScope.error = 'Invalid credentials.';
                });
            }
        };

        $scope.signup = function (isValid) {
            if(isValid) {
                delete $scope.signupFormInvalid;
                var formData = {
                    name: $scope.name,
                    email: $scope.email,
                    password: $scope.password,
                    password_confirmation: $scope.password_confirmation
                };

                authService.signup(formData, successAuth, function (res) {
                    $rootScope.error = res.error || 'Failed to sign up.';
                });
            }
            else {
                $scope.signupFormInvalid = true;
            }
        };

        $scope.logout = function () {
            authService.logout(successLogout);
        };
    }]);
})();
