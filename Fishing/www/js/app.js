/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function chunk(arr, size) {
    var newArr = [];
    var arrLength = size;
    if (arrLength > arr.length) {
        arrLength = arr.length;
    }
    for (var i = 0; i < arrLength; i++) {
        newArr.push(arr[i]);
    }
    return newArr;
}

if ( !Date.prototype.toISODate ) {
    ( function() {

        function pad(number) {
            var r = String(number);
            if ( r.length === 1 ) {
                r = '0' + r;
            }
            return r;
        }

        Date.prototype.toISODate = function() {
            return this.getFullYear()
                + '-' + pad( this.getMonth() + 1 )
                + '-' + pad( this.getDate() )
        };

    }() );
}

Array.prototype.removeValue = function(name, value){

    var array = $.map(this, function(v,i){

        return v[name] === value ? null : v;

    });

    this.length = 0; //clear original array

    this.push.apply(this, array); //push all elements except the one we want to delete
}

var currentPage="";
document.addEventListener("deviceready", onDeviceReady, false);
var app = angular.module('Fishing',['ngRoute','ngAnimate','ui.calendar',"ngTouch","page","keyboard","validation.match","RatingApp","nvKeyboard"]);
app.config(['$routeProvider',"$keyboardProvider",
    function($routeProvider,$keyboardProvider) {
        $keyboardProvider.init({
            scrollPaneID: '#scroll',
            headerID: false,
            bodyID: '.page',
            footerID: false,
            binders : 'input[type="text"],textarea,input[type="password"],input[type="tel"],input[type="email"]'
        });
        $routeProvider.
            when("/",{
                title:"Sign Up",
                animation: "slide",
                templateUrl:"view/signup.html",
                controller:"signupCtrl"
            })
            .when("/emailreg",{
              title:"Sign Up",
                animation: "slide",
              templateUrl:"view/email-registration.html",
              controller:"emailRegCtrl"
            })
            .when("/loginpage",{
                title:"Login Page",
                animation: "slide",
                templateUrl:"view/loginpage.html",
                controller:"loginPageCtrl"
            })
            .when('/forgot', {
                title: 'Booking',
                templateUrl:'view/forget-pass.html',
                controller: 'forgotPassCtrl',
                animation: "slide"
            })
            .when('/home', {
                title: 'Home ',
                templateUrl: 'view/home.html',
                controller: 'homeCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {};
                        var lakeCategory = localFactory.post('lake_category', postData);
                        lakeCategory.success(function (data) {
                            defer.resolve(data);
                            localFactory.unload();
                        });

                        lakeCategory.error(function (data, status, headers, config) {
                            defer.reject(data);
                            localFactory.unload();
                        });

                        return defer.promise;
                    }
                }
            }).when('/Search', {
                title: 'Search Event',
                templateUrl:'view/search.html',
                controller :'searchCtrl'
            }).when('/lakelist/:id', {
                title: 'Lake List',
                templateUrl:'view/lakes.html',
                controller: 'lakeListCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory, $routeParams, storeData) {
                        localFactory.load();
                        var defer = $q.defer();

                        var cat_id = $route.current.params.id;

                        //cat_id=1&user_no=1&fishing_type=1&fish_spacies=1&fish_rules=1&lake_amenitites=1&latitude=56.939191&longitude=23.989926
                        var postData = {latitude: 56.939191, longitude: 23.989926};

                        postData['user_no'] = storeData.getData().loginData.user_details.user_no;
                        if ($route.current.params.id == "adsearch") {

                            var lake_amenites = storeData.getData().loginData.lake_amentites;
                            var lakeAmenites = [];

                            var lake_rules = storeData.getData().loginData.lake_rules;
                            var lakeRules = [];

                            var fishSpacies = storeData.getData().loginData.lake_spacies;

                            for (var i = 0; i < lake_amenites.length; i++) {
                                if (lake_amenites[i]['active']) {
                                    lakeAmenites.push(lake_amenites[i]['id']);
                                }
                            }

                            for (var i = 0; i < lake_rules.length; i++) {

                                if (lake_rules[i]['active']) {
                                    lakeRules.push(lake_rules[i]['id']);
                                }
                            }

                            postData['fish_spacies'] = JSON.stringify(fishSpacies);
                            postData['fish_rules'] = lakeRules.join();
                            postData['lake_amenitites'] = lakeAmenites.join();

                            var fishType = []
                            for (var i = 0; i < tabs.length; i++) {
                                if (!tabs[i]['state']) {
                                    fishType.push(tabs[i]['id']);
                                }
                            }
                            postData['fishing_type'] = fishType.join();

                        } else if ($route.current.params.id == "recentitems") {
                            postData['lake_ids'] = $.parseJSON(localFactory.getLocalItem('recent_items'))['value'].join();
                        } else if ($route.current.params.id != "nearby") {

                            postData['cat_id'] = $route.current.params.id;
                        }

                        console.log(postData);
                        var lakeCategory = localFactory.post('lake_cat_listing', postData);
                        lakeCategory.success(function (data) {
                            defer.resolve(data);
                            localFactory.unload();
                        });

                        lakeCategory.error(function (data, status, headers, config) {
                            defer.reject(data);
                            localFactory.unload();
                        });

                        return defer.promise;
                    }
                }
            }).when('/lakeDetail/:id', {
                title:'Lake Details',
                templateUrl:'view/lake-detail.html',
                controller: 'lakeDetailCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {lake_id: $route.current.params.id};
                        var lakeCategory = localFactory.post('lake_details', postData);
                        lakeCategory.success(function (data) {
                            defer.resolve(data);
                            localFactory.unload();
                        });

                        lakeCategory.error(function (data, status, headers, config) {
                            defer.reject(data);
                            localFactory.unload();
                        });

                        return defer.promise;
                    }
                }
            })
            .when('/booking', {
                title: 'Booking',
                templateUrl:'view/booking.html',
                controller :'bookingCtrl'
            })
            .when('/review/:id', {
                title: 'Review',
                templateUrl:'view/reviews.html',
                controller: 'reviewsCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {lake_id: $route.current.params.id};
                        var lakeCategory = localFactory.post('review', postData);
                        lakeCategory.success(function (data) {
                            defer.resolve(data);
                            localFactory.unload();
                        });

                        lakeCategory.error(function (data, status, headers, config) {
                            defer.reject(data);
                            localFactory.unload();
                        });

                        return defer.promise;
                    }
                }
            })
            .when('/photos/:id', {
                title: 'Photos',
                templateUrl:'view/photos.html',
                controller: 'photosCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {lake_id: $route.current.params.id};
                        var lakeCategory = localFactory.post('lake_image', postData);
                        lakeCategory.success(function (data) {
                            defer.resolve(data);
                            localFactory.unload();
                        });

                        lakeCategory.error(function (data, status, headers, config) {
                            defer.reject(data);
                            localFactory.unload();
                        });

                        return defer.promise;
                    }
                }
            })
            .when('/checkin', {
                title: 'Photos',
                templateUrl:'view/checkin.html',
                controller :'checkinCtrl'
            })
            .when('/owner', {
                title: 'Photos',
                templateUrl:'view/lake-owner.html',
                controller :'lakeOwner'
            })
            .when('/confirm', {
                title: 'Confirm Booking',
                templateUrl: 'view/ticket-screen.html',
                controller: 'ticketBookCtrl'
            })
            .when('/mybookmark', {
                title: 'My Bookmark',
                templateUrl: 'view/my-bookmarks.html',
                controller: 'bookmarkCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory, storeData) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {latitude: 56.939191, longitude: 23.989926};
                        postData['user_no'] = storeData.getData().loginData.user_details.user_no;
                        postData['is_fev'] = true;

                        var myBookMark = localFactory.post('lake_cat_listing', postData);
                        myBookMark.success(function (data) {
                            defer.resolve(data);
                            localFactory.unload();
                        });

                        myBookMark.error(function (data, status, headers, config) {
                            defer.reject(data);
                            localFactory.unload();
                        });

                        return defer.promise;
                    }
                }
            })
            .when('/mytickets', {
                title: 'My Tickets',
                templateUrl: 'view/my-tickets.html',
                controller: 'myTicketCtrl'
            })
            .when('/connectac', {
                title: 'Connect Account',
                templateUrl: 'view/connect-accounts.html',
                controller: 'connectAccCtrl'
            })
            .when('/suggestLocation', {
                title: 'Suggest Location',
                templateUrl: 'view/suggest-location.html',
                controller: 'suggestCtrl'
            })
            .when('/sendFeedback', {
                title: 'Send Feedback',
                templateUrl: 'view/send-feedback.html',
                controller: 'feedbackCtrl'
            })
            .when('/reportBug', {
                title: 'Report Bug',
                templateUrl: 'view/report-bug.html',
                controller: 'reportCtrl'
            })
            .when('/contactus', {
                title: 'Contact Us',
                templateUrl: 'view/contact-us.html',
                controller: 'contactCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
app.value("keyboardHeight",0);
app.run(['$location', '$rootScope','keyboardHeight',"$keyboard", function($location,$rootScope,keyboardHeight,$keyboard) {
    $keyboard.restrictSpecialChar();
    $rootScope.stateHistory = [];

    $rootScope.popupMask = false; // footer popup mask
    $rootScope.currentTab = 0;

    $rootScope.goBack=function()
    {
        window.history.back();
    }
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.anim = current.$$route.animation;
        $rootScope.title = current.$$route.title;
        console.log(current.$$route.title);
    });
}]);

// device APIs are available
function onDeviceReady() {
    angular.bootstrap(document, ["Fishing"]);
    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    document.addEventListener("backbutton", backKeyDown, true);
}

function backKeyDown()
{
    if(currentPage=="historyList")
    {
        window.location.hash = '#/';

    }else if(currentPage=="homeCtrl")
    {
        navigator.app.exitApp();

    }else{

        window.history.back();
    }
}


/*
 app.animation('.page-size', function() {
 return {
 enter: function(element, done) {

 $(element).addClass('slideup');
 //run the animation here and call done when the animation is complete
 return function(cancelled) {
 //this (optional) function will be called when the animation
 //completes or when the animation is cancelled (the cancelled
 //flag will be set to true if cancelled).
 };
 },
 leave: function(element, done) {

 },
 move: function(element, done) {

 },
 //animation that can be triggered before the class is added
 beforeAddClass: function(element, className, done) {

 },

 //animation that can be triggered after the class is added
 addClass: function(element, className, done) {

 },
 //animation that can be triggered before the class is removed
 beforeRemoveClass: function(element, className, done) {

 },
 //animation that can be triggered after the class is removed
 removeClass: function(element, className, done) {

 }
 };
 });*/
