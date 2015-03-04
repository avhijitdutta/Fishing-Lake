/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var input_offset = {
    top: 0,
    left: 0
};
var initValues = {
    scrollPaneID: '#scroll',
    headerID: '#header',
    bodyID: 'body',
    footerID: '#footer',
    binders : 'input[type="text"],textarea,input[type="password"],input[type="tel"],input[type="email"]'
};
angular.module('nvKeyboard', []).provider('$keyboard', function () {
    return {
        init: function (initParams) {
            initValues = initParams || {
                scrollPaneID: '#scroll',
                bodyID: 'body',
                headerID: '#header',
                footerID: '#footer',
                binders : 'input[type="text"],textarea'
            };
            window.addEventListener('native.keyboardhide',function(e)
            {
                $(initValues.scrollPaneID).animate({scrollTop: 0}, '200');
            });

            window.addEventListener('native.keyboardshow', function (e) {
                setTimeout(function () {
                    if (input_offset.top > 0) {

                        var foterHeight = $(initValues.footerID).height() || 0;
                        var bodyHeight = $(initValues.bodyID).height() || 0;
                        var headerHeight = $(initValues.headerID).height() || 0;

                        console.log('footer height', foterHeight);
                        console.log('body height', bodyHeight);
                        console.log('Header height', headerHeight);

                        var keyBoardHeight = e.keyboardHeight;
                        var bodyHeightWithoutfooter = bodyHeight - foterHeight;
                        var actualBodyHeight = bodyHeight + keyBoardHeight;
                        var actualBodyHeightWithoutHeader = actualBodyHeight - headerHeight;

                        console.log('keyBoardHeight ', keyBoardHeight);
                        console.log('bodyHeightWithoutfooter', bodyHeightWithoutfooter);
                        console.log('actualBodyHeight', actualBodyHeight);
                        console.log('actualBodyHeightWithoutHeader', actualBodyHeightWithoutHeader);

                        var elementHeight = input_offset.element.height();
                        var input_top = input_offset.top + elementHeight;

                        console.log('elementHeight height', elementHeight);
                        console.log('input_top height', input_top);

                        if (input_top >= bodyHeightWithoutfooter) {
                            var scrollTop = input_top - bodyHeight + foterHeight + 20;
                            $(initValues.scrollPaneID).animate({scrollTop: scrollTop}, '200');
                            console.log('scrollTop height', scrollTop);
                        }
                        scrollTop = 0;
                        input_offset = {
                            top: 0,
                            left: 0
                        };
                    }
                }, 200);
            });
            $('body').on('click', initValues.binders, function () {
                input_offset = $(this).offset();
                input_offset.element = $(this);
            });

            $('body').on('focusout', initValues.binders, function () {
                $(initValues.scrollPaneID).animate({scrollTop: 0}, '400');
            });
        },
        resetVaribles: function () {
            input_offset = {
                top: 0,
                left: 0
            };
        },
        $get: ['$rootScope', '$q',
            function ($rootScope, $q) {

            }]
    };
}).directive('showOnKeyboard', ['$log', 'current_target_offset', function ($log, current_target_offset) {
        return{
            restrict: 'A', //E = element, A = attribute, C = class, M = comment
            link: function ($scope, element, attrs) {//Embed a custom controller in the directive
                $(element).on("click", function () {
                    input_offset = $(this).offset();
                    input_offset.element = $(this);
                });
            }
        };
    }]);
