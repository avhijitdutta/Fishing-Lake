/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
                templateUrl:"view/signup.html",
                controller:"signupCtrl"
            })
            .when("/emailreg",{
              title:"Sign Up",
              templateUrl:"view/email-registration.html",
              controller:"emailRegCtrl"
            })
            .when("/loginpage",{
                title:"Login Page",
                templateUrl:"view/loginpage.html",
                controller:"loginPageCtrl"
            })
            .when('/forgot', {
                title: 'Booking',
                templateUrl:'view/forget-pass.html',
                controller :'forgotPassCtrl'
            })
            .when('/home', {
                title: 'Home ',
                templateUrl: 'view/home.html',
                controller : 'homeCtrl'
            }).when('/Search', {
                title: 'Search Event',
                templateUrl:'view/search.html',
                controller :'searchCtrl'
            }).when('/lakelist', {
                title: 'Lake List',
                templateUrl:'view/lakes.html',
                controller :'lakeListCtrl'
            }).when('/lakeDetail/:id', {
                title:'Lake Details',
                templateUrl:'view/lake-detail.html',
                controller :'lakeDetailCtrl'
            })
            .when('/booking', {
                title: 'Booking',
                templateUrl:'view/booking.html',
                controller :'bookingCtrl'
            })
            .when('/review', {
                title: 'Review',
                templateUrl:'view/reviews.html',
                controller :'reviewsCtrl'
            })
            .when('/photos', {
                title: 'Photos',
                templateUrl:'view/photos.html',
                controller :'photosCtrl'
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
                templateUrl:'view/ticket-screen.html',
                controller :'ticketBookCtrl'
            })
            .when('/mybookmark', {
                title: 'My Bookmark',
                templateUrl:'view/my-bookmarks.html',
                controller :'bookmarkCtrl'
            })
            .when('/mytickets', {
                title: 'My Tickets',
                templateUrl:'view/my-tickets.html',
                controller :'myTicketCtrl'
            })
            .when('/connectac', {
                title: 'Connect Account',
                templateUrl:'view/connect-accounts.html',
                controller :'connectAccCtrl'
            })
            .when('/suggestLocation', {
                title: 'Suggest Location',
                templateUrl:'view/suggest-location.html',
                controller :'suggestCtrl'
            })
            .when('/sendFeedback', {
                title: 'Send Feedback',
                templateUrl:'view/send-feedback.html',
                controller :'feedbackCtrl'
            })
            .when('/reportBug', {
                title: 'Report Bug',
                templateUrl:'view/report-bug.html',
                controller :'reportCtrl'
            })
            .when('/contactus', {
                title: 'Contact Us',
                templateUrl:'view/contact-us.html',
                controller :'contactCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
app.value("keyboardHeight",0);
app.run(['$location', '$rootScope','keyboardHeight',"$keyboard", function($location,$rootScope,keyboardHeight,$keyboard) {
    $keyboard.restrictSpecialChar();
    $rootScope.stateHistory = [];
    $rootScope.goBack=function()
    {
        window.history.back();
    }
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

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



