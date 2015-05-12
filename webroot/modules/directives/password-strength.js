(function () {
    'use strict';

    angular.module('directives.passwordStrength', []).
    directive('passwordStrength', [function() {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            //require: 'ngModel',
            link: function (scope, element, attributes, control) {

            var checker = {
                colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                measureStrength: function (p) {
                    var _force = 0;

                    var _lowerLetters = /[a-z]+/.test(p);
                    var _upperLetters = /[A-Z]+/.test(p);
                    var _numbers = /[0-9]+/.test(p);
                    var _symbols = /[!-\/|:-@|\[-`|\{-~]/g.test(p);

                    /*var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                    var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

                    _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                    _force += _passedMatches * 10;

                    // penality (short password)
                    _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                    // penality (poor variety of characters)
                    _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                    _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                    _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                    return _force;*/
                    return 10;
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
            scope.strengthStyle = function(level) {
                return "strength_" + level; // FIXME: should be based on strength and level
            };

            scope.$watch(attributes.checkStrength, function () {
                if (scope.pw !== "") {
                    var strength = checker.measureStrength(scope.pw);
                    var c = checker.getColor(strength);
                    var ul = element.find('ul');
                    ul.css({"display": "inline"});

                    var lis = ul.find('li');
                    lis.css({"background": "#DDD"});
                    for(var i = 0; i < c.idx; i++) {
                        angular.element(lis[i]).css({"background": c.col});
                    }
                    //lis.slice(0, c.idx);
                    //    .css({"background": c.col});
                } else {
                    element.css({"display": "none"});
                }
                });
            },
            template: '<ul id="strength"><li ng-class="strengthStyle(0)"></li><li ng-class="strengthStyle(1)"></li><li ng-class="strengthStyle(2)"></li><li ng-class="strengthStyle(3)"></li><li ng-class="strengthStyle(4)"></li></ul>'
        };
    }]);
})();
