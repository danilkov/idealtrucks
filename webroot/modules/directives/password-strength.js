(function() {
    'use strict';

    angular.module('directives.passwordStrength', []).
    directive('passwordStrength', [function() {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            require: 'ngModel',
            link: function(scope, element, attributes, control) {

                var checker = {
                    measureStrength: function(password) {
                        var strength = -1;

                        if(password) {
                            if(/[a-z]+/.test(password)) { // lower-case letters
                                strength++;
                            }
                            if(/[A-Z]+/.test(password)) { // upper-case letters
                                strength++;
                            }
                            if(/[0-9]+/.test(password)) { // numbers
                                strength++;
                            }
                            if(/[^a-zA-Z\d]/.test(password)) { // non alpha-numeric
                                strength++;
                            }
                            if(password.length < 7) {
                                if(strength > 0) {
                                    strength--;
                                }
                            }
                            else if(password.length > 9) {
                                strength++;
                            }
                        }

                        return strength;
                    }
                };

                scope.strengthStyle = function(level) {
                    if(level <= scope.passwordStrength) {
                        return "strength_" + scope.passwordStrength;
                    }
                    else {
                        return null;
                    }
                };

                scope.$watch(attributes.ngModel, function () {
                    var password = scope.$eval(attributes.ngModel);
                    if(password && password !== "") {
                        scope.passwordStrength = checker.measureStrength(password);
                        element.css({"display": "inline"});
                        control.$setValidity("passwordTooWeek", scope.passwordStrength >= 2);
                    }
                    else {
                        scope.passwordStrength = -1;
                        element.css({"display": "none"});
                        control.$setValidity("passwordTooWeek", true);
                    }
                });
            },
            template: '<ul id="strength"><li ng-class="strengthStyle(0)"></li><li ng-class="strengthStyle(1)"></li><li ng-class="strengthStyle(2)"></li><li ng-class="strengthStyle(3)"></li><li ng-class="strengthStyle(4)"></li></ul>'
        };
    }]);
})();
