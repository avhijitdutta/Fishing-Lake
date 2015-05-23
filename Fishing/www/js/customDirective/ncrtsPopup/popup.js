angular.module("ncrtsPopup", [])
    .directive("popup", function () {
        var directive = {};

        directive.restrict = 'E';
        /* restrict this directive to elements */

        directive.template = '<div class="popup-mask" ng-show="display" ng-click="display=false"> </div><div class="discount-popup" ng-show="display"> <img src="images/ico_image_gallery.png" ng-click="fromGallery()"> <img src="images/ico_take_photo.png" ng-click="fromCamera()"></div>';

        directive.compile = function (element, attributes) {
            // do one-time configuration of element.

            var linkFunction = function ($scope, element, atttributes) {
                // bind element to data in $scope

            }

            return linkFunction;
        }

        directive.scope = {
            display: "=display",
            camera: "&fromCamera",
            gallery: "&fromGallery"
        }

        directive.controller = function ($scope) {
            $scope.fromGallery = function () {
                $scope.gallery();
            }

            $scope.fromCamera = function () {
                $scope.camera();
            }
        }
        return directive;
    });
