(function () {
    'use strict';

    angular.module('directives.passwordStrength', []).
    directive('passwordStrength', [function() {
        return {
            restrict: 'E',
            scope: true,
            require: 'ngModel',
            link: function (scope, element, attributes, control) {

            var strength = {
                colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                mesureStrength: function (p) {
                    var _force = 0;

                    var _lowerLetters = /[a-z]+/.test(p);
                    var _upperLetters = /[A-Z]+/.test(p);
                    var _numbers = /[0-9]+/.test(p);
                    var _symbols = /[!-\/|:-@|\[-`|\{-~]/g.test(p);

                    var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                    var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

                    _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                    _force += _passedMatches * 10;

                    // penality (short password)
                    _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                    // penality (poor variety of characters)
                    _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                    _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                    _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                    return _force;
                },
                getColor: function (s) { // TODO: optimize?
                    var idx = 0;
                    if (s <= 10) { idx = 0; }
                    else if (s <= 20) { idx = 1; }
                    else if (s <= 30) { idx = 2; }
                    else if (s <= 40) { idx = 3; }
                    else { idx = 4; }

                    return { idx: idx + 1, col: this.colors[idx] };
                }
            };

            scope.$watch(attributes.checkStrength, function () {
                if (scope.pw === "") {
                    element.css({ "display": "none"  });
                }
                else {
                    var strength = strength.mesureStrength(scope.pw);
                    var c = strength.getColor(strength);
                    element.css({ "display": "inline" });
                    element.children('li')
                        .css({ "background": "#DDD" })
                        .slice(0, c.idx)
                        .css({ "background": c.col });
                    }
                });
            },
            template: '<ul id="strength"><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li></ul>'
        };
    }]);
})();
