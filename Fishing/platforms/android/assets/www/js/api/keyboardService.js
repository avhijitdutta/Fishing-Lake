/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};
var input_offset = {
    top: 0,
    left: 0
};
var scrolled = 0;
var initValues = {
    scrollPaneID: '#scroll',
    headerID: '#header',
    bodyID: 'body',
    footerID: '#footer',
    binders: 'input[type="text"],textarea'
};
angular.module('nvKeyboard', []).provider('$keyboard', function () {
    return {
        init: function (initParams) {
            initValues = initParams || {
                scrollPaneID: '#scroll',
                bodyID: 'body',
                headerID: '#header',
                footerID: '#footer',
                binders: 'input[type="text"],textarea'
            };
            window.addEventListener('native.keyboardshow', function (e) {
                setTimeout(function () {
                    if (input_offset.top > 0) {

                        var foterHeight = $(initValues.footerID).height() || 0;
                        var bodyHeight = $(initValues.bodyID).height() || 0;
                        var headerHeight = $(initValues.headerID).height() || 0;
                        var scrollPaneHeight = $(initValues.scrollPaneID).prop('scrollHeight') || 0;

                        console.log('footer height', foterHeight);
                        console.log('body height', bodyHeight);
                        console.log('Header height', headerHeight);
                        console.log('scrollPaneHeight height', scrollPaneHeight);

                        var keyBoardHeight = e.keyboardHeight;
                        var bodyHeightWithoutfooter = bodyHeight - foterHeight;
                        var actualBodyHeight = bodyHeight + keyBoardHeight - 25;
                        var actualBodyHeightWithoutHeader = actualBodyHeight - headerHeight;

                        console.log('keyBoardHeight ', keyBoardHeight);
                        console.log('bodyHeightWithoutfooter', bodyHeightWithoutfooter);
                        console.log('actualBodyHeight', actualBodyHeight);
                        console.log('actualBodyHeightWithoutHeader', actualBodyHeightWithoutHeader);

                        var elementHeight = input_offset.element.height();
                        var input_top = input_offset.top + elementHeight;

                        var adder = $(initValues.scrollPaneID).scrollTop();

                        /*  console.log('Adder', adder);
                         console.log('input_offset.top height', input_offset.top);
                         console.log('elementHeight height', elementHeight);
                         console.log('input_top height', input_top);

                         */
                        if (input_top >= bodyHeightWithoutfooter) {
                            var scrollTop = input_top - bodyHeightWithoutfooter + 20 + adder;
                            $(initValues.scrollPaneID).animate({scrollTop: scrollTop}, '400');
                            /* console.log('scrollTop height', scrollTop);*/
                            scrolled = scrollTop;
                        } else {
                            scrolled = 0;
                        }
                        scrollTop = 0;
                        input_offset = {
                            top: 0,
                            left: 0
                        };
                    }
                }, 500);
            });
            window.addEventListener('native.keyboardhide', function (e) {
                if (scrolled != 0) {

                }
            });
            $('body').on('click', initValues.binders, function () {
                input_offset = $(this).offset();
                input_offset.element = $(this);
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
                return {
                    restrictSpecialChar: function (binders) {
                        binders = binders || 'input[type="text"],textarea';
                        $('body').on('keyup', binders, function (e) {
                            /* console.log('test for local');*/
                            var msg = "Special charecter is not allowed.";
                            var val = $(this).val();
                            var patt = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';/{}/()|\\":<>\?]/);
                            var res = patt.test(val);
//                            if ($(this).hasAttr('alowed-special')) {
//                                var splChar = $(this).attr('alowed-special');
//                                if (splChar) {
//                                    patt = new RegExp(splChar);
//                                    msg = "Only " + splChars + " are allowed";
//                                    res = patt.test(val);
//                                    res = !res;
//                                }
//                            }
                            if (!$(this).hasAttr('alowed-special')) {
                                if (res) {
                                    if (val.length > 0) {
                                        val = val.slice(0, -1);
                                    }
                                    $(this).val(val);
                                    alert(msg);
                                    return false;
                                }
                            }
                        });
                    }
                };
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