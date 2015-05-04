(function () {
    'use strict';

    angular.module('directives.confirmPassword', []).
    directive('confirmPassword', [function() {
        return {
            restrict: 'A',
            scope:true,
            require: 'ngModel',
            link: function (scope, element, attributes, control) {
                var checker = function () {
                    var password = scope.$eval(attributes.ngModel);
                    var confirmedPassword = scope.$eval(attributes.confirmPassword);
                    return password == confirmedPassword;
                };
                scope.$watch(checker, function (isConfirmed) {
                    control.$setValidity("passwordMismatch", isConfirmed);
                });
            }
        };
    }]);
});