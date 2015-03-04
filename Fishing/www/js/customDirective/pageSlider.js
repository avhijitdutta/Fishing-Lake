/*The restrict option is typically set to:

'A' - only matches attribute name
'E' - only matches element name
'C' - only matches class name
These restrictions can all be combined as needed:
'AEC' - matches either attribute or element or class name
*/
angular.module('page',[])
.directive('mobileSlider', function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment
            require: '?ngClass',/*^ -- Look for the controller on parent elements, not just on the local scope ? -- Don't raise an error if the controller isn't found*/
            scope: {
                ngClass:'='
                 //@ reads the attribute value, = provides two-way binding, & works with functions
            },
            link: function ($scope, element, attrs) {//Embed a custom controller in the directive
                element.bind('click', function () {
                    //element.html('You clicked me!');
                });
            }, //DOM manipulation
            controller: ['$scope',"$route","$location","$rootScope",function($scope,$route,$location,$rootScope) {

                $scope.animationClass={'slideLeft':'slide-left','slideRight':'slide-right','slideIn':"at-view-slide-in-top",slideOut:"at-view-slide-out-bottom",fadeIn:'at-view-fade-in',fadeOut:'at-view-fade-out'};

                // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
                var l = $rootScope.stateHistory.length,
                    state = window.location.hash;

                if (l === 0) {
                    $rootScope.stateHistory.push(state);
                    slidePageFrom($scope.animationClass.fadeIn);
                    return;
                }
                if (state === $rootScope.stateHistory[l-2]) {
                    console.log("pop");
                    $rootScope.stateHistory.pop();
                    slidePageFrom($rootScope.animation, 1);
                } else {
                    $rootScope.stateHistory.push(state);
                    slidePageFrom($rootScope.animation);
                }
                //console.log($rootScope.stateHistory);
                // Use this function directly if you want to control the sliding direction outside PageSlider
                function slidePageFrom(page,prevFlag) {
                    if(prevFlag)
                    {
                        $rootScope.animation=$scope.animationClass.slideOut;
                    }else
                    {
                        $rootScope.animation=$scope.animationClass.slideIn;
                    }

                }

            }]

        }
});

angular.module("keyboard",[])
    .directive('keyboardAttach',['keyboardHeight', function(keyboardHeight) {
        return{
            restrict: 'A', //E = element, A = attribute, C = class, M = comment
            scope: {
                keyBoard:'@'
                //@ reads the attribute value, = provides two-way binding, & works with functions
            },
            link: function ($scope, element, attrs) {//Embed a custom controller in the directive
                $(element).on("click",function(){
                  /* if(keyboardHeight==0)
                   {
                       window.addEventListener('native.keyboardshow', keyboardShowHandler);
                       function keyboardShowHandler(e) {
                           console.log(e);
                           keyboardHeight= e.keyboardHeight;
                       }
                   }*/
                });
            }//DOM manipulation
        }
    }]);

function keyboardAttachGetClientHeight(element) {
    return element.clientHeight;
}


angular.module('validation.match', []);

angular.module('validation.match').directive('match', match);

function match ($parse) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
            if(!ctrl) {
                if(console && console.warn){
                    console.warn('Match validation requires ngModel to be on the element');
                }
                return;
            }

            var matchGetter = $parse(attrs.match);

            scope.$watch(getMatchValue, function(){
                ctrl.$validate();
            });

            ctrl.$validators.match = function(){
                return ctrl.$viewValue === getMatchValue();
            };

            function getMatchValue(){
                var match = matchGetter(scope);
                if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
}

angular.module("RatingApp", [])
    .directive("starRating", function() {
        return {
            restrict :"A",
            template :"<img ng-repeat='star in stars' ng-class='starClass(star, $index)' ng-click='toggle($index)'>",
            scope : {
                ratingValue : "=",
                max : "=",
                onRatingSelected : "&"
            },
            link : function(scope, elem, attrs) {

                var updateStars = function() {
                    scope.stars = [];
                    for ( var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled : i < scope.ratingValue
                        });
                    }
                };

                scope.starClass = function(/** Star */ star, /** Integer */ idx) {
                    var starClass ='not-filled';
                    if (star.filled) {
                        starClass = 'filled';
                    }
                    return starClass;
                };

                scope.toggle = function(index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating : index + 1
                    });
                };

                scope.$watch("ratingValue", function(oldVal, newVal) {
                    if (newVal) { updateStars(); }
                });
            }
        };
    });

'use strict';

angular.module('validation.match').filter('myCurrency', ['$filter', function ($filter) {
    return function(input) {
        input = parseFloat(input);

        if(input % 1 === 0) {
            input = input.toFixed(0);
        }
        else {
            input = input.toFixed(2);
        }

        return '$' + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
}]);
/*
window.addEventListener('native.keyboardshow', keyboardShowHandler);

function keyboardShowHandler(e){
    $('#project-body').animate({
        scrollTop: $('#').position().top + parseInt($("#project-body").scrollTop())
    }, 1000);
}*/
