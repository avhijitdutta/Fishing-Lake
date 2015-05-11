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

if ( !Date.prototype.displayDate ) {
    ( function() {
        Date.prototype.displayDate = function() {
            var arrMonth = ["JAN", "FEV", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            return this.getDate()+" "+arrMonth[this.getMonth()]+' '+this.getFullYear();
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
var defaultPath = "/signup";
document.addEventListener("deviceready", onDeviceReady, false);
var app = angular.module('Fishing', ['ngRoute', 'ngAnimate', 'ui.calendar', "ngTouch", "page", "keyboard", "validation.match", "RatingApp", "nvKeyboard", 'ngCordova','angucomplete','angular-carousel','angular-loading-bar','ncSocials']);
app.config(['$routeProvider',"$keyboardProvider",'cfpLoadingBarProvider','$twitterProvider',
    function($routeProvider,$keyboardProvider,cfpLoadingBarProvider,$twitterProvider) {
        $keyboardProvider.init({
            scrollPaneID: '.scroll',
            headerID: '.ncr-header',
            bodyID: '.page',
            footerID: '.ncr-footer',
            binders : 'input[type="text"],textarea,input[type="password"],input[type="tel"],input[type="email"]'
        });

        $twitterProvider.init({
            consumerKey: 'Vez5NV9FmsxizbnOEzpaPJRhy', // YOUR Twitter CONSUMER_KEY
            consumerSecret: 'yCTm32Ycxa0gDOTyZj5FO4CHOEzQMsEPrGJvXU6v4Dm6pr1yBX', // YOUR Twitter CONSUMER_SECRET
            callbackUrl: "ncrts.com"
        });

        cfpLoadingBarProvider.includeSpinner = false;

        if (window.localStorage.getItem('loginData') && window.localStorage.getItem('loginData') != "" && window.localStorage.getItem('loginData') != null) {

            defaultPath = "/home";
        }

        $routeProvider.
            when("/signup", {
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
                title: 'Forgot Password',
                templateUrl:'view/forget-pass.html',
                controller: 'forgotPassCtrl',
                animation: "slide"
            })
            .when('/home', {
                title: 'Home ',
                templateUrl: 'view/home.html',
                controller: 'homeCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory,$cordovaGeolocation) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {};
                        var lakeCategory = localFactory.post('lake_category', postData);
                        lakeCategory.success(function (data) {
                           defer.resolve(data);
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
                controller :'searchCtrl',
                resolve:{
                    geoData:function($route,$q,localFactory,storeData,$cordovaGeolocation){
                        localFactory.load()
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                        var defer=$q.defer();
                        $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function (position) {

                                var latLong = {latLong: {latitude: position.coords.latitude, longitude: position.coords.longitude}};
                                storeData.setData(latLong);
                                defer.resolve(latLong);
                            }, function (err) {
                                defer.reject(data);
                            });
                        return defer.promise;
                    }
                }
            }).when('/lakelist/:id', {
                title: 'Lake List',
                templateUrl:'view/lakes.html',
                controller: 'lakeListCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory, $routeParams, storeData) {
                        localFactory.load();
                        var postData={};
                        var defer = $q.defer();
                        postData = storeData.getData(true)['latLong'];
                        postData['user_no'] = storeData.getData().loginData.user_details.user_no;
                        if ($route.current.params.id == "adsearch") {

                            var lake_amenites = storeData.getData(true).loginData.lake_amentites;
                            var lakeAmenites = [];

                            var lake_rules = storeData.getData(true).loginData.lake_rules;
                            var lakeRules = [];

                            var fishSpacies = storeData.getData(true).loginData.lake_spacies;

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

                        } else if ($route.current.params.id == "quickSearch") {

                            var fishType = []
                            for (var i = 0; i < tabs.length; i++) {
                                if (!tabs[i]['state']) {
                                    fishType.push(tabs[i]['id']);
                                }
                            }
                            postData['fishing_type'] = fishType.join();

                        }
                        else if ($route.current.params.id == "recentitems") {

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
                    homeData: function ($route, $q, localFactory,$cordovaGeolocation,storeData) {
                        localFactory.load();
                        var defer = $q.defer();
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                        $cordovaGeolocation
                        .getCurrentPosition(posOptions)
                        .then(function (position) {
                            var postData = {lake_id: $route.current.params.id,latitude: position.coords.latitude, longitude: position.coords.longitude,user_no:storeData.getData().loginData.user_details.user_no};
                            var lakeCategory = localFactory.post('lake_details', postData);
                            lakeCategory.success(function (data) {
                                defer.resolve(data);
                                localFactory.unload();
                            });

                            lakeCategory.error(function (data, status, headers, config) {
                                defer.reject(data);
                                localFactory.unload();
                            });
                        }, function (err) {
                            defer.reject(err);
                        });
                        return defer.promise;
                    }
                }
            })
            .when('/booking/:id', {
                title: 'Booking',
                templateUrl:'view/booking.html',
                controller: 'bookingCtrl',
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
            .when('/owner/:id', {
                title: 'Lake Owner',
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
                controller: 'myTicketCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory, storeData) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {};
                        postData['user_no'] =storeData.getData().loginData.user_details.user_no;
                        var myBookMark = localFactory.post('past_future_ticket', postData);
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
            .when('/ticketDetails', {
                title: 'Ticket',
                templateUrl: 'view/detailsTicket.html',
                controller: 'ticketDetails'
            })
            .when('/imgTag', {
                title: 'Image tag',
                templateUrl: 'view/tagImg.html',
                controller: 'tagImgCtrl',
                resolve: {
                    homeData: function ($route, $q, localFactory, storeData) {
                        localFactory.load();
                        var defer = $q.defer();
                        var postData = {latitude: 56.939191, longitude: 23.989926};
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
            })
            .otherwise({
                redirectTo: defaultPath
            });
    }]);
app.value("keyboardHeight",0);
app.run(['$location', '$rootScope', 'keyboardHeight', "$keyboard", '$cordovaFacebook', 'localFactory', 'storeData', function ($location, $rootScope, keyboardHeight, $keyboard, $cordovaFacebook, localFactory, storeData) {
    $keyboard.restrictSpecialChar();
    $rootScope.stateHistory = [];

    $rootScope.popupMask = false; // footer popup mask
    $rootScope.currentTab = 0;

    $rootScope.goBack=function()
    {
        window.history.back();
    }

    if (!localFactory.getLocalItem('social')) {
        var obj={social:[{name:'Facebook',is_connected:false,authkey:"",Profilename:"",id:1,post_activity:true,imgUrl:"images/user-photo.jpg"},{name:'Twitter',is_connected:false,authkey:"",Profilename:"",id:2,post_activity:false,imgUrl:"images/user-photo.jpg"}]};
        storeData.setData(obj);
    }
    $rootScope.fbLogin = function () {

        $cordovaFacebook.getLoginStatus()
            .then(function (success) {
                console.log(success);

                if (success.status == 'connected') {

                    $location.path("home");

                } else {

                    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                        .then(function (success) {
                            console.log(success);
                            var credential = {
                                email_id: success.email,
                                facebook_id: success.id,
                                first_name: success.first_name,
                                last_name: success.last_name,
                                fb_url: success.link
                            };
                            console.log(credential);
                            var login = localFactory.post('login', credential);
                            login.success(function (data) {
                                localFactory.unload();

                                if (data.result) {

                                    data['loginType'] = '1';// login type 1 means fb
                                    var objData = {loginData: data};
                                    storeData.setData(objData);
                                    $location.path("home");

                                } else {

                                    localFactory.alert(data.msg, function () {

                                    }, "Message", 'OK');
                                }

                            });

                            login.error(function (data, status, headers, config) {
                                localFactory.unload();
                            });

                        }, function (error) {
                            // error
                        });
                }
            }, function (error) {
                console.log(error);
            });
    }

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        //$rootScope.anim = current.$$route.animation;
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
