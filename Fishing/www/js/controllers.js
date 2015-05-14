/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('homeCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$timeout', '$route', '$cordovaGeolocation', 'storeData', function ($rootScope, $scope, $location, localFactory, $timeout, $route, $cordovaGeolocation, storeData) {
    currentPage = "homeCtrl";
    storeData.setData(storeData.getData());
    $scope.tabs = tabs;
    $scope.toggle = function (id) {
        var active = this.tab.active;
        var inactive = this.tab.inactive;
        this.tab.active = inactive;
        this.tab.inactive = active;
        this.tab.state = !this.tab.state;
    };

    $scope.openSearch = function (value) {
        $location.path("Search");
    }

    $scope.listCollection = $route.current.locals.homeData.lake_category;
    console.log($route.current.locals.homeData);
    $scope.viewDetail = function (value) {
        localFactory.load();
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                var latLong = {latLong: {latitude: position.coords.latitude, longitude: position.coords.longitude}};
                storeData.setData(latLong);
                $location.path("lakelist/" + value);
            }, function (err) {
                localFactory.unload();
                alert(err);

            });
    }

    $scope.quickSearch = function (value) {
        $location.path("lakelist/quickSearch");
    }

    $scope.openSearch = function (value) {
        $location.path("Search");
    }
    localFactory.unload();
    $scope.backButtonHide = true;
}]);

app.controller('searchCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', 'storeData', '$cordovaGeolocation', '$q', function ($rootScope, $scope, $location, localFactory, $route, storeData, $cordovaGeolocation, $q) {
    currentPage = "searchCtrl";
    $scope.is_search = true;
    $scope.tabs = tabs;
    $scope.lat = "";
    $scope.long = "";
    $scope.filterOptions = [
        {
            id: 3,
            name: "Fish Species",
            url: "images/ico-fish.png"
        },
        {
            id: 1,
            name: "Accessibility",
            url: "images/ico-accessibility.png"
        },
        {
            id: 2,
            name: "Fishing Rules",
            url: "images/ico-ts.png"
        }
    ]

    $scope.toggle = function (id) {
        var active = this.tab.active;
        var inactive = this.tab.inactive;
        this.tab.active = inactive;
        this.tab.inactive = active;
        this.tab.state = !this.tab.state;
    };

    // filter data
    $scope.filterData =
    {
        1: {data: storeData.getData(true).loginData.lake_amentites, name: 'amentites', value: 'Accessibility'},
        2: {data: storeData.getData(true).loginData.lake_rules, name: 'rules', value: 'Fishing Rules'},
        3: {data: storeData.getData(true).loginData.lake_spacies, name: 'spacies', value: 'Fish Species'}
    };

    console.log($scope.filterData);

    $scope.showList = function () {

        $location.path("lakelist/advanceSearch");
    }

    $scope.rightPanel = false;
    $scope.currentFilter = "";
    $scope.showFilter = function (value) {
        $scope.currentFilter = $scope.filterData[value];
        if ($scope.rightPanel) {
            $scope.rightPanel = false;

        } else {

            $scope.rightPanel = true;
        }
    }

    // filter click function
    $scope.hideRightPanel = function (value) {
        $scope.rightPanel = false; // filter out
    }

    $scope.bookOnline = true;
    $scope.bookText = "Search";
    $scope.bookImg = "";

    /**** search list page****/
    $scope.bookNow = function () {
        $location.path("lakelist/adsearch");
    }

    $scope.toggleItem = function (value, flag) {
        for (var i = 0; i < $scope.currentFilter['data'].length; i++) {
            if ($scope.currentFilter['data'][i].id == value.id) {
                if (flag) {
                    if ($scope.currentFilter['data'][i].specimen) {
                        $scope.currentFilter['data'][i].specimen = false;
                    } else {
                        $scope.currentFilter['data'][i].specimen = true;
                    }
                } else {
                    if ($scope.currentFilter['data'][i].active) {
                        $scope.currentFilter['data'][i].active = false;

                    } else {

                        $scope.currentFilter['data'][i].active = true;
                    }
                }
            }

        }
    }

    var latLong = $route.current.locals.geoData.latLong;
    $scope.address = "";
    var input = (document.getElementById('location-search'));
    var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        var latLong = {latLong: {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()}};
        storeData.setData(latLong);
    });

    $scope.resetLocation = function () {
        localFactory.load();
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        var defer = $q.defer();
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var latLong = {latLong: {latitude: position.coords.latitude, longitude: position.coords.longitude}};
                storeData.setData(latLong);
                $scope.address = "";
                localFactory.unload();
            }, function (err) {
                defer.reject(data);
            });

    }
    localFactory.unload();
}]);

app.controller('bookingCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$compile', "uiCalendarConfig", 'storeData', '$routeParams', '$route', 'paypal', function ($rootScope, $scope, $location, localFactory, $compile, uiCalendarConfig, storeData, $routeParams, $route, paypal) {
    currentPage = "bookingCtrl";
    paypal.init();
    $scope.lakeDetails = $route.current.locals.homeData;
    $scope.selectedLake = $route.current.locals.homeData.lake_category;
    console.log($scope.selectedLake);
    $scope.date = "None Selected";
    $scope.displayDate = "None Selected";
    $scope.totalPrice = 0;
    $scope.ticket = "";
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        var today = new Date();
        var formattedDate = new Date(date);
        if (formattedDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)) {
            $scope.date = date.toISODate();
            $scope.displayDate = date.displayDate();
            if ($scope.date != "None Selected" && $scope.ticket != "") {
                $scope.bookOnline = true;
                $scope.rightPanel = false;
            }
        } else {

            localFactory.alert("You can't choose previous date ", function () {

            }, "Alert", "Ok");
        }
    }

    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: 200,
            editable: true,
            header: {
                left: 'title',
                center: '',
                right: 'next'
            },
            dayClick: $scope.alertOnEventClick
        }
    };

    $scope.tab = 1;

    $scope.arrPrices = $scope.lakeDetails.lake_pricing;

    for (var i = 0; i < $scope.arrPrices.length; i++) {
        $scope.arrPrices[i]['qty'] = 0;
        $scope.arrPrices[i]['totalPrice'] = 0.00
    }

    $scope.totalPrice = 0.00;
    $scope.qtyPlusMin = function (id, sign) {
        $scope.ticket = "";
        $scope.totalPrice = 0.00;
        for (var i = 0; i < $scope.arrPrices.length; i++) {
            if ($scope.arrPrices[i]['price_id'] == id) {
                if (sign == 1) {
                    $scope.arrPrices[i]['qty'] = $scope.arrPrices[i]['qty'] + 1;

                } else {
                    if ($scope.arrPrices[i]['qty'] > 0) {
                        $scope.arrPrices[i]['qty'] = $scope.arrPrices[i]['qty'] - 1;
                    }
                }
                $scope.arrPrices[i]['totalPrice'] = parseInt($scope.arrPrices[i]['qty']) * parseFloat($scope.arrPrices[i]['price']);
            }

            $scope.totalPrice = (parseFloat($scope.arrPrices[i]['totalPrice']) + parseFloat($scope.totalPrice)).toFixed(2);

            if ($scope.arrPrices[i]['qty'] > 0) {
                $scope.ticket += $scope.arrPrices[i]['description'] + " " + $scope.arrPrices[i]['qty'] + ",";

            }
        }

        if ($scope.date != "None Selected" && $scope.ticket != "") {
            $scope.bookOnline = true;
        }
    }

    $scope.rightPanel = false;
    $scope.showPopup = function (value) {
        $scope.tab = value;
        $scope.showAddReview = false;
        if ($scope.rightPanel) {

            $scope.rightPanel = false;

        } else {

            $scope.rightPanel = true;
        }
    }

    // filter click function
    $scope.hideRightPanel = function (value) {
        $scope.rightPanel = false; // filter out
    }

    //book button
    $scope.bookOnline = false;
    $scope.bookText = "Book Now";
    $scope.bookImg = "";


    //confirm ticket booking
    $scope.bookNow = function () {

        var setData = {
            amount: $scope.totalPrice,
            currencyType: "EUR",
            marchentName: "Hot Fishing"
        }
        paypal.setData(setData);
        var onSuccess = function (payment) {
            console.log(JSON.stringify(payment));
            if (payment.response.state == 'approved') {
                localFactory.load();
                var postData = {lake_id: $routeParams.id, user_no: storeData.getData().loginData.user_details.user_no, date: $scope.date, json: JSON.stringify($scope.arrPrices), total_price: $scope.totalPrice};
                var bookMark = localFactory.post('lake_booking', postData);
                bookMark.success(function (data) {
                    localFactory.unload();
                    if (data.result) {
                        var tempObj = data;
                        tempObj['bookingObj'] = {totalPrice: $scope.totalPrice, ticket: $scope.ticket, date: $scope.displayDate};
                        var obj = {currentBooking: tempObj};
                        storeData.setData(obj);
                        localFactory.alert(data.msg, function () {
                        }, "Message", 'OK');
                        $location.path("confirm");
                    }
                });

                bookMark.error(function (data, status, headers, config) {
                    localFactory.unload();
                });

            }

        }

        var onCancel = function (result) {

        }

        paypal.uiPayment(onSuccess, onCancel);
    }
}]);

app.controller('lakeListCtrl', ['$rootScope', '$scope', '$location', 'localFactory', "$route", 'storeData', function ($rootScope, $scope, $location, localFactory, $route, storeData) {
    currentPage = "lakeListCtrl";
    $scope.lackList = $route.current.locals.homeData.lake_cat_listing;
    $scope.lakeDetailView = function (value) {

        $location.path("lakeDetail/" + value);
    }

    $scope.bookmark = function (lake) {

        var postData = {lake_id: lake.id, user_no: storeData.getData().loginData.user_details.user_no};
        var bookMark = localFactory.post('favorite_lake', postData);
        bookMark.success(function (data) {
            console.log(data);
            localFactory.unload();
            if (data.result) {
                for (var i = 0; i < $scope.lackList.length; i++) {
                    if ($scope.lackList[i]['id'] == lake.id) {

                        if (data.is_fev) {

                            $scope.lackList[i]['fav_id'] = 999;

                        } else {

                            $scope.lackList[i]['fav_id'] = "";
                        }

                    }
                }
                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');

            } else {

                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
            }
        });

        bookMark.error(function (data, status, headers, config) {

        });
    }
}]);


app.controller('lakeDetailCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', '$routeParams', 'storeData', "$cordovaFileTransfer", '$cordovaCamera', '$cordovaGeolocation', function ($rootScope, $scope, $location, localFactory, $route, $routeParams, storeData, $cordovaFileTransfer, $cordovaCamera, $cordovaGeolocation) {

    $scope.lakeId = $routeParams.id;
    currentPage = "lakeDetail";

    // store data in local storage in recent items
    $scope.recentItems = {value: []};
    if (localFactory.getLocalItem('recent_items')) {
        $scope.recentItems = $.parseJSON(localFactory.getLocalItem('recent_items'));
        if ($.inArray($scope.lakeId, $scope.recentItems['value']) < 0) {
            $scope.recentItems['value'].push($scope.lakeId);
            localFactory.setLocalItem('recent_items', JSON.stringify($scope.recentItems));
        }
    }
    else {

        $scope.recentItems['value'].push($scope.lakeId);
        localFactory.setLocalItem('recent_items', JSON.stringify($scope.recentItems));
    }

    $scope.lakeDetail = "";
    if ($route.current.locals.homeData.result) {
        $scope.lakeDetail = $route.current.locals.homeData;
    }

    var obj = {currentLake: $scope.lakeDetail};
    storeData.setData(obj);

    var map;
    var lakeLatLong;

    function initialize() {
        lakeLatLong = new google.maps.LatLng($scope.lakeDetail.lake_category.latitude, $scope.lakeDetail.lake_category.longitude);
        var mapOptions = {
            zoom: 4,
            center: lakeLatLong,
            draggable: false,
            scrollwheel: false
        }
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var marker = new google.maps.Marker({
            position: lakeLatLong,
            map: map
        });
    }

    initialize();
    $scope.showCheckIn = function () {
        $location.path("checkin");
    }

    $scope.showDirection = function () {
        localFactory.load();
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                var current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                localFactory.unload();
                plugin.google.maps.external.launchNavigation({
                    "from": current,
                    "to": lakeLatLong
                });

            }, function (err) {
                alert(err);
            });

    }

    $scope.showReview = function (id) {
        $location.path("review/" + id);
    }

    $scope.showShare = function () {
        window.plugins.socialsharing.share('Love the hot fishing app ...');
    }

    $scope.showMorePhoto = function (id) {
        $location.path("photos/" + id);
    }

    $scope.bookNow = function () {
        $location.path("booking/" + $scope.lakeId);
    }

    $scope.showOwner = function (id) {
        $location.path("owner/" + id);
    }
    //initiate an array to hold all active tabs
    $scope.activeTabs = [];

    //check if the tab is active
    $scope.isOpenTab = function (tab) {
        //check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            //if so, return true
            return true;
        } else {
            //if not, return false
            return false;
        }
    }

    //function to 'open' a tab
    $scope.openTab = function (tab) {
        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            //if it's not, add it!
            $scope.activeTabs.push(tab);
        }
    }

    $scope.showLakeDetail = function (value) {

        $location.path("lakeDetail/" + value);
    }

    $scope.reviewList = $scope.lakeDetail.lake_review;
    for (var i = 0; i < $scope.reviewList.length; i++) {
        $scope.reviewList[i]['star'] = $scope.reviewList[i]['user_rate'];
        $scope.reviewList[i]['noStar'] = parseInt(5 - $scope.reviewList[i]['user_rate']);
    }

    $scope.getNumber = function (num) {
        var result = [];

        for (var i = 0; i < num; i++) {
            result.push(num);
        }

        return result;
    }
    console.log($scope.reviewList);
    // Ask a question
    $scope.askquestion = "";
    $scope.postFaq = function () {
        if ($scope.askquestion != "") {
            var postData = {lake_id: $scope.lakeId, user_no: storeData.getData().loginData.user_details.user_no, faq: $scope.askquestion};
            var lakeTimeing = localFactory.post('post_faq', postData);
            lakeTimeing.success(function (data) {
                console.log(data);
                localFactory.unload();
                if (data.result) {
                    $scope.askquestion = "";
                    localFactory.alert(data.msg, function () {

                    }, "Message", 'OK');

                } else {

                    localFactory.alert(data.msg, function () {

                    }, "Message", 'OK');
                }
            });

            lakeTimeing.error(function (data, status, headers, config) {

            });
        }
    }


    $scope.bookmark = function () {

        var postData = {lake_id: $scope.lakeId, user_no: storeData.getData().loginData.user_details.user_no};
        var bookMark = localFactory.post('favorite_lake', postData);
        bookMark.success(function (data) {
            localFactory.unload();
            if (data.result) {

                if (data.is_fev == 1) {

                    console.log($scope.lakeDetail);
                    $scope.lakeDetail.lake_category.fav_id = 1;

                } else {

                    $scope.lakeDetail.lake_category.fav_id = "";
                }

                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');

            } else {

                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
            }
        });

        bookMark.error(function (data, status, headers, config) {

        });
    }

    $scope.bookOnline = true;
    $scope.bookText = "Book Online Now";
    $scope.bookImg = "";
    /*filter*/

    $scope.rightPanel = false;
    $scope.showRate = function () {
        $scope.showAddReview = false;
        if ($scope.rightPanel) {
            $scope.rightPanel = false;

        } else {

            $scope.rightPanel = true;
        }
    }

    // filter click function
    $scope.hideRightPanel = function (value) {
        $scope.rightPanel = false; // filter out
    }

    $scope.currentTab = 1;
    $scope.tabs = [
        {
            id: 1,
            name: "Amenities",
            active: "images/ico-amenities-inactive.png",
            inactive: "images/ico-amenities.png",
            url: "images/ico-amenities.png"
        },
        {
            id: 2,
            name: "Fishing Rules",
            inactive: "images/ico-ts-active.png",
            active: "images/ico-ts-inactive.png",
            url: "images/ico-ts-inactive.png"
        },
        {
            id: 3,
            name: "Fish Species",
            active: "images/ico-coarse-inactive.png",
            inactive: "images/ico-coarse-active.png",
            url: "images/ico-coarse-active.png"
        }
    ]

    $scope.tab = 2;

    $scope.setTab = function (tab) {
        $scope.tab = tab.id;
        for (i = 0; i < $scope.tabs.length; i++) {
            if ($scope.tab == $scope.tabs[i].id) {
                $scope.tabs[i].url = $scope.tabs[i].active;
            } else {
                $scope.tabs[i].url = $scope.tabs[i].inactive;
            }
        }
    };

    $scope.isSet = function (active) {
        return active.id == $scope.tab;
    };

    $scope.prices = 100;

    $scope.uploadImg = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.imageURI = imageURI;
            localFactory.load();
            var serverURL = 'http://ncrts.com/fishing_lake/webservice/post_lake_image';
            var options = new FileUploadOptions();
            options.fileKey = "lake_img";
            options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.user_no = storeData.getData().loginData.user_details.user_no;
            params.lake_id = $scope.lakeId;

            options.params = params;

            $cordovaFileTransfer.upload(serverURL, $scope.imageURI, options)
                .then(function (result) {
                    console.log($.parseJSON(result.response));
                    var data = $.parseJSON(result.response);
                    if (data.result) {
                        $scope.lakeDetail.lake_image.push(data.sql_img[0]);
                        localFactory.unload();
                        localFactory.alert('Image uploaded successfully', function () {

                        }, "Message", 'OK');
                    }

                }, function (err) {

                    console.log("error");
                    console.log(err);

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });

        }, function (err) {
            console.log(err);
        });
    }
}]);

app.controller('loginPageCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', '$cordovaFacebook', function ($rootScope, $scope, $location, localFactory, storeData, $cordovaFacebook) {
    $scope.submitForm = function () {

        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {

            var postData = $scope.user;
            localFactory.load();
            var login = localFactory.post('login', postData);
            login.success(function (data) {
                localFactory.unload();

                if (data.result) {

                    data['loginType'] = 0;
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

        } else {

            localFactory.alert("Please enter valid user id and password.", function () {

            }, "Message", 'OK');
        }
    };
}]);

app.controller('forgotPassCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {

    $rootScope.enterAnimation = "slideLeft";
    $rootScope.exitAnimation = "slideRight";
    $scope.user = {};
    $scope.submitForm = function () {
        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {

            console.log($scope.user);
            var postData = $scope.user;
            localFactory.load();
            var forgot = localFactory.post('forget_password', postData);
            forgot.success(function (data) {
                console.log(data);
                $scope.user.email_id = "";
                localFactory.unload();

                localFactory.alert("An email with instructions to reset password has been sent to your email address.", function () {

                }, "Message", 'OK');

            });
            forgot.error(function (data, status, headers, config) {
                localFactory.unload();
            });


        } else {

            localFactory.alert("Enter valid email id", function () {

            }, "Message", 'OK');
        }
    };

}]);

app.controller('emailRegCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$cordovaFacebook', function ($rootScope, $scope, $location, localFactory, $cordovaFacebook) {

    $scope.submitForm = function () {
        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            console.log($scope.user);
            var postData = $scope.user;
            localFactory.load();
            var signup = localFactory.post('signup', postData);
            signup.success(function (data) {
                console.log(data);
                localFactory.unload();
                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
                if (data.result) {
                    $location.path("loginpage");
                }

            });

            signup.error(function (data, status, headers, config) {
                localFactory.unload();
            });


        }
    };
}]);

app.controller('signupCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$cordovaFacebook', function ($rootScope, $scope, $location, localFactory, $cordovaFacebook) {

    $scope.signupEmail = function () {
        $location.path("emailreg");
    }
}]);

app.controller('reviewsCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', 'storeData', function ($rootScope, $scope, $location, localFactory, $route, storeData) {
    $scope.lakeDetail = storeData.getData(true);
    console.log($scope.lakeDetail);
    $scope.reviewList = [];
    if ($route.current.locals.homeData.result) {
        $scope.reviewList = $route.current.locals.homeData.lake_review;
    }


    for (var i = 0; i < $scope.reviewList.length; i++) {
        $scope.reviewList[i]['star'] = $scope.reviewList[i]['user_rate'];
        $scope.reviewList[i]['noStar'] = parseInt(5 - $scope.reviewList[i]['user_rate']);
    }

    console.log($scope.reviewList);
    $scope.bookOnline = true;
    $scope.bookText = "Write a Review";
    $scope.bookImg = "images/ico-writereview.png";

    $scope.bookNow = function () {
        $scope.showAddReview = false;

        if ($scope.rightPanel) {

            $scope.rightPanel = false;

        } else {

            $scope.rightPanel = true;
        }
    }

    $scope.getNumber = function (num) {
        var result = [];

        for (var i = 0; i < num; i++) {
            result.push(num);
        }

        return result;
    }
    // filter click function
    $scope.hideRightPanel = function (value) {
        $scope.rightPanel = false; // filter out
    }
}]);

app.controller('photosCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', '$cordovaCamera', '$cordovaFileTransfer', 'storeData', function ($rootScope, $scope, $location, localFactory, $route, $cordovaCamera, $cordovaFileTransfer, storeData) {
    $scope.lake_image = [];
    if ($route.current.locals.homeData.result) {

        $scope.lake_image = $route.current.locals.homeData.lake_image;
    }
    console.log($scope.lake_image);
    $scope.bookOnline = true;
    $scope.bookText = "Upload Photos";
    $scope.bookImg = "images/ico-upload.png";
    $scope.currentLake = storeData.getData(true).currentLake.lake_category;
    console.log($scope.currentLake);
    $scope.lakeId = storeData.getData(true).currentLake.lake_category.id
    $scope.bookNow = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.imageURI = imageURI;
            localFactory.load();
            var serverURL = 'http://ncrts.com/fishing_lake/webservice/post_lake_image';
            var options = new FileUploadOptions();
            options.fileKey = "lake_img";
            options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.user_no = storeData.getData().loginData.user_details.user_no;
            params.lake_id = $scope.lakeId;

            options.params = params;

            console.log(options.params);
            $cordovaFileTransfer.upload(serverURL, $scope.imageURI, options)
                .then(function (result) {
                    console.log($.parseJSON(result.response));
                    var data = $.parseJSON(result.response);
                    if (data.result) {
                        $scope.lake_image.push(data.sql_img[0]);
                        localFactory.unload();
                        localFactory.alert('Image uploaded successfully', function () {

                        }, "Message", 'OK');
                    }
                }, function (err) {

                    console.log("error");
                    console.log(err);

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });

        }, function (err) {
            console.log(err);
        });
    }
}]);

app.controller('checkinCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', '$cordovaCamera', '$twitter', function ($rootScope, $scope, $location, localFactory, storeData, $cordovaCamera, $twitter) {
    $scope.bookOnline = true;
    $scope.bookText = "Check In";
    $scope.bookImg = "images/ico-check-in.png";
    $scope.twitter = false;
    $scope.fb = false;
    $scope.bookNow = function () {
        if ($scope.twitter && $twitter.checkSession()) {
            if ($twitter.checkSession()) {
                $twitter.tweet("I am just check in " + $scope.currentLake.lake_category.leke_name, function () {

                });
            }
        } else {
            localFactory.alert("Please add twitter account in connect accounts.");
        }
        window.history.back();

    }

    $scope.socialList =
        [
            {url: 'images/ico-twitter.png', id: 1, deactiveUrl: 'images/ico-twitter.png', activeUrl: 'images/ico-twitter-blue.png', flag: false},
            {url: 'images/ico-fb.png', id: 2, deactiveUrl: 'images/ico-fb.png', activeUrl: 'images/ico-fb-blue.png', flag: false}
        ]

    $scope.toggleSocial = function (value) {
        for (var i = 0; i < $scope.socialList.length; i++) {
            if (value.id == $scope.socialList[i]['id']) {
                if (value.flag) {
                    $scope.socialList[i]['url'] = $scope.socialList[i]['deactiveUrl'];

                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = false;
                    } else {
                        $scope.fb = false;
                    }
                    $scope.socialList[i]['flag'] = false;

                } else {

                    $scope.socialList[i]['url'] = $scope.socialList[i]['activeUrl'];
                    $scope.socialList[i]['flag'] = true;
                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = true;
                    } else {
                        $scope.fb = true;
                    }
                }
            }
        }
    }

    $scope.currentLake = storeData.getData(true).currentLake;
    console.log($scope.currentLake);
    $scope.imageURI = ""; //init imageURI
    $scope.uploadImage = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.imageURI = imageURI;
        }, function (err) {
            console.log(err);
        });
    }

    $scope.lat = $scope.currentLake.lake_category.latitude;
    $scope.long = $scope.currentLake.lake_category.longitude;

    var latlng = new google.maps.LatLng($scope.lat, $scope.long);
    var mapOptions = {
        zoom: 15,
        center: latlng,
        minZoom: 10,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggable: false,
        scrollwheel: false

    };


    var map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);

    var destinationMarker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng($scope.lat, $scope.long),
        draggable: false
    });

}]);

app.controller('lakeOwner', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', "$cordovaCamera", "$cordovaFileTransfer", function ($rootScope, $scope, $location, localFactory, storeData, $cordovaCamera, $cordovaFileTransfer) {

    $scope.showPrev = function () {
        window.history.back();
    }

    $scope.lakeData = storeData.getData(true).currentLake;

    console.log($scope.lakeData);

    $scope.vanueAdd =
        [
            {name: 'Street', value: $scope.lakeData['lake_category']['address1']},
            {name: 'Street1', value: $scope.lakeData['lake_category']['address1']},
            {name: "City", value: $scope.lakeData['lake_category']['city']},
            {name: "Country", value: $scope.lakeData['lake_category']['country']},
            {name: "Post", value: $scope.lakeData['lake_category']['postcode']},
            {name: "Town", value: $scope.lakeData['lake_category']['town']}
        ];

    $scope.list_rules = $scope.lakeData.list_rules;
    $scope.list_amenitites = $scope.lakeData.list_amenitites;

    for (var i = 0; i < $scope.list_rules.length; i++) {
        if ($scope.list_rules[i]['rule_id'] != "") {

            $scope.list_rules[i]['active'] = true;
        } else {
            $scope.list_rules[i]['active'] = false;
        }
    }

    for (var i = 0; i < $scope.list_amenitites.length; i++) {
        if ($scope.list_amenitites[i]['amenitites_id'] != "") {
            $scope.list_amenitites[i]['active'] = true;
        } else {
            $scope.list_amenitites[i]['active'] = false;
        }
    }

    //update contact details
    $scope.formData = {};
    $scope.formData['lakeName'] = $scope.lakeData.lake_category.leke_name;
    $scope.formData['id'] = $scope.lakeData.lake_category.id;
    /*$scope.formData['address'] = $scope.vanueAdd;*/
    $scope.formData['desc'] = $scope.lakeData.lake_category.desc;
    $scope.formData['list_amenitites'] = $scope.list_amenitites;
    $scope.formData['list_rules'] = $scope.list_rules;
    $scope.formData['list_spacies'] = $scope.lakeData.list_spacies;
    $scope.formData['lake_pricing'] = $scope.lakeData.lake_pricing;
    $scope['contact_details'] =
        [
            {name: "Contact Person", type: "text", value: $scope.lakeData.lake_category.contact_person, label: 'contact_person'},
            {name: "Contact Number", type: "tel", value: $scope.lakeData.lake_category.contact_number, label: 'contact_number'},
            {name: "Email", type: "email", value: $scope.lakeData.lake_category.email, label: 'email'}
        ];
    $scope.formData['lake_image'] = $scope.lakeData.lake_image;

    $scope.lakeTimeing = [];

    for (var i = 0; i < $scope.lakeData.lake_timing.length; i++) {
        var openHours = (parseInt($scope.lakeData.lake_timing[i]['opening_time'].substr(0, 2)) > 12) ? parseInt($scope.lakeData.lake_timing[i]['opening_time'].substr(0, 2)) - 12 : parseInt($scope.lakeData.lake_timing[i]['opening_time'].substr(0, 2));
        var openMinutes = parseInt($scope.lakeData.lake_timing[i]['opening_time'].substr(3));
        var openMidday = ((parseInt($scope.lakeData.lake_timing[i]['opening_time'].substr(0, 2)) > 12) ? "PM" : "AM");

        var closeHours = (parseInt($scope.lakeData.lake_timing[i]['closing_time'].substr(0, 2)) > 12) ? parseInt($scope.lakeData.lake_timing[i]['closing_time'].substr(0, 2)) - 12 : parseInt($scope.lakeData.lake_timing[i]['closing_time'].substr(0, 2));
        var closeMinutes = parseInt($scope.lakeData.lake_timing[i]['closing_time'].substr(3));
        var closeMidday = ((parseInt($scope.lakeData.lake_timing[i]['opening_time'].substr(0, 2)) > 12) ? "PM" : "AM");
        var is_close = ($scope.lakeData.lake_timing[i]['is_close'] == 1) ? true : false;
        console.log($scope.lakeData.lake_timing[i]['opening_time'].substr(0, 1));
        var temp = {};
        temp['Opening'] = {hours: openHours, minutes: openMinutes, midday: openMidday};
        temp['name'] = $scope.lakeData.lake_timing[i]['day'];
        temp['Closing'] = {hours: closeHours, minutes: closeMinutes, midday: closeMidday};
        temp['close'] = is_close;
        temp['id'] = $scope.lakeData.lake_timing[i]['id'];
        $scope.lakeTimeing.push(temp);
    }

    /* $scope.days = */
    console.log($scope.lakeTimeing);
    $scope.itemActive = function (item, facilites) {
        var length = facilites.length;
        for (var i = 0; i < length; i++) {
            if (facilites[i].id == item.id) {
                if (item.active) {
                    facilites[i].active = false;

                } else {
                    facilites[i].active = true;
                }
            }
        }
    }

    $scope.itemToggle = function (item, fishSpecies, species) {
        var length = fishSpecies.length;
        for (var i = 0; i < length; i++) {
            if (fishSpecies[i].id == item.id) {
                if (species) {
                    if (item.specimen) {
                        fishSpecies[i].specimen = 0;

                    } else {
                        fishSpecies[i].specimen = 1;
                    }
                } else {
                    if (item.normal) {
                        fishSpecies[i].normal = 0;

                    } else {
                        fishSpecies[i].normal = 1;
                    }
                }
            }

        }

    }

    //rightPanelAddMember
    $scope.rightPanelAddMember = false;
    $scope.showAddBox = function () {
        if ($scope.rightPanelAddMember) {
            $scope.rightPanelAddMember = false;
            $scope.rightPanel = false;

        } else {
            $scope.rightPanelAddMember = true;
            $scope.rightPanel = true;
        }
    }


    $scope.days = $scope.lakeTimeing;


    $scope.rightPanelTime = false;
    $scope.selectedTime = {};
    $scope.addTime = function (days, isOpening) {

        if (isOpening) {
            $scope.selectedTime = days;
            $scope.selectedTime['open'] = true;
        }
        else {
            $scope.selectedTime = days;
            $scope.selectedTime['open'] = false;
        }

        console.log($scope.selectedTime);
        if ($scope.rightPanelTime) {
            $scope.rightPanelTime = false;

        } else {

            $scope.rightPanelTime = true;
        }
    }


    $scope.hidePanelTime = function () {
        $scope.rightPanelTime = false;
    }

    $scope.updateOpening = function () {

        $scope.rightPanelTime = false;
    }

    $scope.increseTime = function (isHours, isPlus) {
        if ($scope.selectedTime['open']) {

            if (isHours) {
                if (isPlus) {
                    $scope.selectedTime['Opening'].hours = $scope.selectedTime['Opening'].hours + 1;
                    if ($scope.selectedTime['Opening'].hours > 12) {
                        $scope.selectedTime['Opening'].hours = $scope.selectedTime['Opening'].hours - 12;
                    }
                }
                else {
                    $scope.selectedTime['Opening'].hours = $scope.selectedTime['Opening'].hours - 1;
                    if ($scope.selectedTime['Opening'].hours < 0) {
                        $scope.selectedTime['Opening'].hours = 12;
                    }
                }

            } else {

                if (isPlus) {
                    $scope.selectedTime['Opening'].minutes = $scope.selectedTime['Opening'].minutes + 1;
                    if ($scope.selectedTime['Opening'].minutes > 60) {
                        $scope.selectedTime['Opening'].minutes = $scope.selectedTime['Opening'].minutes - 60;
                    }
                }
                else {
                    $scope.selectedTime['Opening'].minutes = $scope.selectedTime['Opening'].minutes - 1;
                    if ($scope.selectedTime['Opening'].minutes < 0) {
                        $scope.selectedTime['Opening'].minutes = 60;
                    }
                }
            }

        } else {
            if (isHours) {
                if (isPlus) {
                    $scope.selectedTime['Closing'].hours = $scope.selectedTime['Closing'].hours + 1;
                    if ($scope.selectedTime['Closing'].hours > 12) {
                        $scope.selectedTime['Closing'].hours = $scope.selectedTime['Closing'].hours - 12;
                    }
                }
                else {
                    $scope.selectedTime['Closing'].hours = $scope.selectedTime['Closing'].hours - 1;
                    if ($scope.selectedTime['Closing'].hours < 0) {
                        $scope.selectedTime['Closing'].hours = 12;
                    }
                }

            } else {

                if (isPlus) {
                    $scope.selectedTime['Closing'].minutes = $scope.selectedTime['Closing'].minutes + 1;
                    if ($scope.selectedTime['Closing'].minutes > 60) {
                        $scope.selectedTime['Closing'].minutes = $scope.selectedTime['Closing'].minutes - 60;
                    }
                }
                else {
                    $scope.selectedTime['Closing'].minutes = $scope.selectedTime['Closing'].minutes - 1;
                    if ($scope.selectedTime['Closing'].minutes < 0) {
                        $scope.selectedTime['Closing'].minutes = 60;
                    }
                }
            }
        }


    }

    // midday change
    $scope.changeMidday = function () {
        console.log($scope.selectedTime);
        if ($scope.selectedTime['open']) {
            if ($scope.selectedTime['Opening'].midday == "AM") {
                $scope.selectedTime['Opening'].midday = "PM";

            } else {
                $scope.selectedTime['Opening'].midday = "AM";
            }
        } else {
            if ($scope.selectedTime['Closing'].midday == "AM") {
                $scope.selectedTime['Closing'].midday = "PM";

            } else {
                $scope.selectedTime['Closing'].midday = "AM";
            }
        }

    }

    //lakelist details
    $scope.nearByLacks = [];
    //right panel add another lake
    $scope.rightPanelLake = false;
    $scope.showRightLake = function () {
        if ($scope.rightPanelLake) {
            $scope.rightPanelLake = false;
        } else {

            localFactory.load();
            var postData = {lake_id: $scope.lakeData.lake_category.id, user_no: storeData.getData().loginData.user_details.user_no, latitude: $scope.lakeData.lake_category.latitude, longitude: $scope.lakeData.lake_category.longitude};
            var remove = localFactory.post('nearby_lake', postData);
            remove.success(function (data) {


                if (data.result) {
                    console.log(data);
                    $scope.nearByLacks = data.nearby_lake;
                    localFactory.unload();
                    $scope.rightPanelLake = true;
                }

            });

            remove.error(function (data, status, headers, config) {
                localFactory.unload();
            });
        }
    }

    $scope.hidePanelLake = function () {
        if ($scope.rightPanelLake) {
            $scope.rightPanelLake = false;

        } else {

            $scope.rightPanelLake = true;
        }
    }

    // lake list search
    $scope.removePhoto = function (value) {
        localFactory.load();
        var postData = {img_id: value.id};
        var remove = localFactory.post('delete_image', postData);
        remove.success(function (data) {
            console.log(data);
            if (data.result) {

                $scope.formData.lake_image.removeValue('id', value.id);
                localFactory.unload();
                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
            }

        });

        remove.error(function (data, status, headers, config) {
            localFactory.unload();
        });
    }

    // for show claim box
    $scope.showClaimForm = false;
    $scope.currentClaimData = {};
    $scope.showClaimBox = function (obj) {
        $scope.showClaimForm = true;
        $scope.currentClaimData = obj;
        console.log($scope.currentClaimData);
    }

    //update claimlake detail and model
    $scope.claimLakeDetails = [
        {name: "email_id", type: "email", placeHolder: "Enter your email address", value: ""},
        {name: "name", type: "text", placeHolder: "Your name", value: ""},
        {name: "ph", type: "tel", placeHolder: "Contact phone no", value: ""}
    ];

    $scope.claimFormData = {};
    $scope.claimFormData.claimLakeDetails = $scope.claimLakeDetails;

    $scope.submitForm = function () {

        // check to make sure the form is completely valid
        if ($scope.claimForm.$valid) {

            var postData = {user_no: storeData.getData().loginData.user_details.user_no, lake_id: $scope.lakeData.lake_category.id};
            for (var i = 0; i < $scope.claimFormData.claimLakeDetails.length; i++) {
                postData[$scope.claimFormData.claimLakeDetails[i]['name']] = $scope.claimFormData.claimLakeDetails[i]['value'];
            }

            localFactory.load();
            var login = localFactory.post('lake_claim', postData);
            login.success(function (data) {
                localFactory.unload();

                if (data.result) {

                    $scope.showClaimForm = false;
                    $scope.rightPanelLake = false;
                } else {

                    localFactory.alert(data.msg, function () {

                    }, "Message", 'OK');
                }

            });

            login.error(function (data, status, headers, config) {
                localFactory.unload();
            });

        }
    };

    $scope.claimLakeUpdate = function () {
        $scope.showClaimForm = false;
    }

    $scope.addLake = function (item) {
        for (var i = 0; i < $scope.nearByLacks.length; i++) {
            if ($scope.nearByLacks[i]['id'] == item.id) {
                $scope.nearByLacks[i]['can_add'] = false;
                $scope.nearByLacks[i]['added'] = true;
                break;
            }
        }
    }

    $scope.updateLakeName = function ($event) {
        $scope.updateColor($event.target);
    }

    $scope.updateColor = function (event) {
        angular.element(event).removeClass('btn-update');
        angular.element(event).addClass('btn-updated');
        $(event).find('img').attr("src", 'images/ico-tick-bgreen.png');
    }

    $scope.bookOnline = true;
    $scope.bookText = "Submit";

    $scope.bookNow = function () {
        console.log($scope.days);
        if ($scope.editLake.$valid) {
            localFactory.load();
            var lakeTime = [];
            for (var i = 0; i < $scope.days.length; i++) {
                var tempObj = {id: $scope.days[i]['id'], day: $scope.days[i]['name'], lake_id: $scope.lakeData.lake_category.id};
                var closeHours = (($scope.days[i]['Closing']['midday'] == "PM") ? parseInt($scope.days[i]['Closing']['hours']) + 12 : parseInt($scope.days[i]['Closing']['hours']));
                closeHours = ((closeHours < 9) ? '0' + closeHours : closeHours);
                var CloseMinutes = (($scope.days[i]['Closing']['minutes'] < 9) ? '0' + $scope.days[i]['Closing']['minutes'] : $scope.days[i]['Closing']['minutes']);
                tempObj['closing_time'] = closeHours + ":" + CloseMinutes;

                var openHours = (($scope.days[i]['Opening']['midday'] == "PM") ? parseInt($scope.days[i]['Opening']['hours']) + 12 : parseInt($scope.days[i]['Opening']['hours']));
                openHours = ((openHours < 9) ? '0' + openHours : openHours);
                var openMinutes = ((parseInt($scope.days[i]['Opening']['minutes']) < 9) ? '0' + $scope.days[i]['Opening']['minutes'] : $scope.days[i]['Opening']['minutes']);
                tempObj['opening_time'] = openHours + ":" + openMinutes;
                lakeTime.push(tempObj);
            }
            $scope.formData['lake_timing'] = lakeTime;

            var lakeadd = {};
            for (var i = 0; i < $scope.vanueAdd.length; i++) {
                lakeadd[$scope.vanueAdd[i]['name']] = $scope.vanueAdd[i]['value'];
            }
            $scope.formData['address'] = lakeadd;

            var contact_details = {}
            for (var i = 0; i < $scope.contact_details.length; i++) {
                contact_details[$scope.contact_details[i]['label']] = $scope.contact_details[i]['value'];
            }
            $scope.formData['contact_details'] = contact_details;
            console.log(JSON.stringify($scope.formData));
            var postData = {json: JSON.stringify($scope.formData)};
            var login = localFactory.post('lake_total_update', postData);
            login.success(function (data) {
                localFactory.unload();

                if (data.result) {

                    localFactory.alert(data.msg, function () {

                    }, "Message", 'OK');

                    window.history.back();

                } else {

                    localFactory.alert(data.msg, function () {

                    }, "Message", 'OK');
                }

            });

            login.error(function (data, status, headers, config) {
                localFactory.unload();
            });

        } else {

            localFactory.alert('Please fix the all error in form.', function () {

            }, "Message", 'OK');
        }
    }

    $scope.uploadImg = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            var imageURI = imageURI;
            localFactory.load();
            var serverURL = 'http://ncrts.com/fishing_lake/webservice/post_lake_image';
            var options = new FileUploadOptions();
            options.fileKey = "lake_img";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.lake_id = $scope.lakeData.lake_category.id;

            options.params = params;

            $cordovaFileTransfer.upload(serverURL, imageURI, options)
                .then(function (result) {
                    localFactory.unload();
                    console.log(result);

                    localFactory.alert('Image uploaded successfully', function () {

                    }, "Message", 'OK');

                    $location.path('home');

                }, function (err) {

                    console.log("error");
                    console.log(err);

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });

        }, function (err) {
            console.log(err);
        });
    }

    $scope.uploadProfileImg = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            var imageURI = imageURI;
            $scope.lakeData.profile_pic = imageURI;
            localFactory.load();
            var serverURL = 'http://ncrts.com/fishing_lake/webservice/post_profile_image';
            var options = new FileUploadOptions();
            options.fileKey = "lake_img";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.lake_id = $scope.lakeData.lake_category.id;

            options.params = params;

            $cordovaFileTransfer.upload(serverURL, imageURI, options)
                .then(function (result) {
                    localFactory.unload();
                    localFactory.alert('Image update successfully', function () {

                    }, "Message", 'OK');
                }, function (err) {

                    console.log("error");
                    console.log(err);

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });

        }, function (err) {
            console.log(err);
        });
    }

    $scope.removeLake = function (obj) {

        localFactory.load();
        var postData = {linked_lake_id: obj.id, lake_id: $scope.lakeData.lake_category.id};
        var remove = localFactory.post('remove_link', postData);
        remove.success(function (data) {
            if (data.result) {
                $scope.lakeData['other_lake'].removeValue('id', obj.id);
                localFactory.unload();
                localFactory.alert(data.msg, function () {
                }, "Message", 'OK');
            }

        });

        remove.error(function (data, status, headers, config) {
            localFactory.unload();
        });

    }

}]);

app.controller('ticketBookCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', '$cordovaGeolocation', function ($rootScope, $scope, $location, localFactory, storeData, $cordovaGeolocation) {
    $scope.backHome = function () {
        $location.path("home");
    }

    $scope.rateApp = function () {

    }

    $scope.showDirection = function () {
        localFactory.load();
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                var current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                localFactory.unload();
                plugin.google.maps.external.launchNavigation({
                    "from": current,
                    "to": lakeLatLong
                });

            }, function (err) {
                alert(err);
            });

    }

    $scope.currentBooking = storeData.getData(true).currentBooking;

    console.log($scope.currentBooking);
    $scope.lakeDetail = storeData.getData(true).currentLake;

    console.log($scope.lakeDetail);

    var map;
    var lakeLatLong;

    function initialize() {
        lakeLatLong = new google.maps.LatLng($scope.lakeDetail.lake_category.latitude, $scope.lakeDetail.lake_category.longitude);
        var mapOptions = {
            zoom: 4,
            center: lakeLatLong,
            draggable: false,
            scrollwheel: false
        }
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var marker = new google.maps.Marker({
            position: lakeLatLong,
            map: map
        });
    }

    initialize();
    //initiate an array to hold all active tabs
    $scope.activeTabs = [];

    //check if the tab is active
    $scope.isOpenTab = function (tab) {
        //check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            //if so, return true
            return true;
        } else {
            //if not, return false
            return false;
        }
    }

    //function to 'open' a tab
    $scope.openTab = function (tab) {
        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            //if it's not, add it!
            $scope.activeTabs.push(tab);
        }
    }

    $scope.currentTab = 1;
    $scope.tabs = [
        {
            id: 1,
            name: "Amenities",
            active: "images/ico-amenities-inactive.png",
            inactive: "images/ico-amenities.png",
            url: "images/ico-amenities.png"
        },
        {
            id: 2,
            name: "Fishing Rules",
            inactive: "images/ico-ts-active.png",
            active: "images/ico-ts-inactive.png",
            url: "images/ico-ts-inactive.png"
        }
    ]

    $scope.tab = 1;

    $scope.setTab = function (tab) {
        $scope.tab = tab.id;
        for (i = 0; i < $scope.tabs.length; i++) {
            if ($scope.tab == $scope.tabs[i].id) {
                $scope.tabs[i].url = $scope.tabs[i].active;
            } else {
                $scope.tabs[i].url = $scope.tabs[i].inactive;
            }
        }
    };

    $scope.isSet = function (active) {
        return active.id == $scope.tab;
    };

    // Ask a question
    $scope.askquestion = "";
    $scope.postFaq = function () {
        if ($scope.askquestion != "") {
            var postData = {lake_id: $scope.lakeId, user_no: storeData.getData().loginData.user_details.user_no, faq: $scope.askquestion};
            var lakeTimeing = localFactory.post('post_faq', postData);
            lakeTimeing.success(function (data) {
                console.log(data);
                localFactory.unload();
                if (data.result) {

                    localFactory.alert(data.msg, function () {

                    }, "Message", 'OK');
                    $scope.askquestion = "";
                } else {

                    localFactory.alert(data.msg, function () {

                    }, "Message", 'OK');
                }
            });

            lakeTimeing.error(function (data, status, headers, config) {

            });
        }
    }
    $scope.backButtonHide = true;

}]);

app.controller('bookmarkCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', 'storeData', function ($rootScope, $scope, $location, localFactory, $route, storeData) {
    $scope.lackList = $route.current.locals.homeData.lake_cat_listing;
    console.log($scope.lackList);
    $scope.deleteBookmark = function (lake) {
        var postData = {lake_id: lake.id, user_no: storeData.getData().loginData.user_details.user_no};
        var bookMark = localFactory.post('favorite_lake', postData);
        bookMark.success(function (data) {
            console.log(data);
            localFactory.unload();
            if (data.result) {
                for (var i = 0; i < $scope.lackList.length; i++) {
                    if ($scope.lackList[i]['id'] == lake.id) {

                        $scope.lackList.splice(i, 1);
                    }
                }
                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');

            } else {

                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
            }
        });

        bookMark.error(function (data, status, headers, config) {

        });
    }

    $scope.linkBookMark = function (obj) {

        $location.path("lakeDetail/1");

    }

    $scope.goBooking = function (obj) {

        $location.path("booking/" + obj.id);

    }

}]);

app.controller('myTicketCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', 'storeData', function ($rootScope, $scope, $location, localFactory, $route, storeData) {
    $scope.tab = 1;
    $scope.futureTicket = function () {
        $scope.tab = 2;
    }

    $scope.pastTicket = function () {
        $scope.tab = 1;
    }

    $scope.tickets = $route.current.locals.homeData;

    $scope.showTicketDetail = function (value) {
        var obj = {currentTicket: value};
        storeData.setData(obj);
        $location.path('ticketDetails');
    }

    $scope.deleteTicket = function (id) {

        var postData = {booking_id: id};
        var bookMark = localFactory.post('inactive_past_ticket', postData);
        bookMark.success(function (data) {
            console.log(data);
            localFactory.unload();
            if (data.result) {
                $scope.tickets.ticket_details.removeValue('id', id);
                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');

            } else {

                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
            }
        });

        bookMark.error(function (data, status, headers, config) {

        });
    }

}]);

app.controller('connectAccCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', '$twitter', function ($rootScope, $scope, $location, localFactory, storeData, $twitter) {
    $scope.social = storeData.getSocialData();
    console.log($scope.social);

    $scope.disConnect = function (value) {
        localFactory.confirm('Disconnect account from Fishing Lake.', function (yes) {
            if (yes == 1) {

                if (value.id == 2) {
                    for (var i = 0; i < $scope.social.length; i++) {
                        if ($scope.social[i]['id'] == value.id) {
                            $scope.social[i]['is_connected'] = false;
                            $scope.social[i]['post_activity'] = false;
                            $scope.social[i]['Profilename'] = "";
                            $scope.social[i]['imgUrl'] = "images/user-photo.jpg";
                            $scope.$apply();
                            $twitter.disconnectAccount();
                            storeData.setData({social: $scope.social});
                        }
                    }
                }

            }
        });


    }

    $scope.connect = function (value) {
        if (value.id == 2) {
            if ($twitter.checkSession() === false) {
                localFactory.confirm('Connect my Twitter account to Fishing Lake.', function (yes) {
                    if (yes == 1) {
                        $twitter.connectToTwitter(function (data) {
                            console.log(data);
                            var userData = $.parseJSON(data['userData']['text']);
                            for (var i = 0; i < $scope.social.length; i++) {
                                if ($scope.social[i]['id'] == value.id) {
                                    $scope.social[i]['is_connected'] = true;
                                    $scope.social[i]['imgUrl'] = userData['profile_image_url'];
                                    $scope.social[i]['Profilename'] = userData.name;
                                    $scope.social[i]['post_activity'] = true;
                                    $scope.$apply();
                                    storeData.setData({social: $scope.social});
                                    console.log(storeData.getSocialData());
                                    break;
                                }
                            }

                        });
                    }
                });
            }
        }
    }

    $scope.check = function (value) {
        for (i = 0; i < $scope.social.length; i++) {
            if ($scope.social[i]['id'] == value.id) {
                if ($scope.social[i]['post_activity']) {
                    $scope.social[i]['post_activity'] = false;
                } else {
                    $scope.social[i]['post_activity'] = true;
                }
            }
        }
        storeData.setData({social: $scope.social});
    }

}]);


app.controller('footerCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', '$cordovaFacebook', '$cordovaCamera', '$cordovaGeolocation', function ($rootScope, $scope, $location, localFactory, storeData, $cordovaFacebook, $cordovaCamera, $cordovaGeolocation) {
    $scope.showList = function () {
        $location.path("lakelist");
    }

    $scope.footerItems = [
        {id: 1, name: 'Add Photo', value: 'addPic', active: false},
        {id: 2, name: 'Me', value: 'me', active: false},
        {id: 3, name: 'Nearby', value: 'near', active: false},
        {id: 4, name: "More", value: 'more', active: false}
    ];

    $scope.meList = [
        {id: 1, name: 'Bookmarks', goto: 'mybookmark'},
        {id: 2, name: 'Connect Accounts', goto: 'connectac'},
        {id: 3, name: 'My Tickets', goto: 'mytickets'},
        {id: 4, name: 'Sign Out', goto: 'signout'}
    ];

    $scope.moreList = [
        {id: 1, name: 'Send Feedback', goto: 'sendFeedback'},
        {id: 2, name: 'Contact us', goto: 'contactus'},
        {id: 3, name: 'Report a bug', goto: 'reportBug'},
        {id: 4, name: 'Suggest a location', goto: 'suggestLocation'},
        {id: 4, name: 'Rate in app store', goto: 'rate'}
    ];

    // if set previous tab
    for (var i = 0; i < $scope.footerItems.length; i++) {
        if ($scope.footerItems[i]['id'] == $rootScope.currentTab) {

            $scope.footerItems[i]['active'] = true;
            break;
        }
    }

    $scope.showMePopup = function (item) {

        $rootScope.currentTab = item.id;

        for (var i = 0; i < $scope.footerItems.length; i++) {
            if ($scope.footerItems[i]['id'] == item.id) {
                $scope.footerItems[i]['active'] = true;

            } else {

                $scope.footerItems[i]['active'] = false;
            }
        }

        if (item.id == 1) {
            $rootScope.popupMask = false;
            $scope.addPic();
        } else if (item.id == 3) {
            localFactory.load();
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {

                    var latLong = {latLong: {latitude: position.coords.latitude, longitude: position.coords.longitude}};
                    storeData.setData(latLong);
                    $rootScope.popupMask = false;
                    $location.path("lakelist/nearby");
                }, function (err) {
                    localFactory.unload();
                    alert(err);

                });


        } else {
            $rootScope.popupMask = true;
            $scope.openPopUp(item.value);
        }

    }

    $scope.closePopUp = function (event) {

        $scope.closePopUp();
    }

    $scope.openPopUp = function (id) {

        if (id == 'more') {

            $scope.currentPopContent = $scope.moreList;

        } else {

            $scope.currentPopContent = $scope.meList;
        }

        $('#me').show();
        $('#me').addClass('slideInUp' + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).show();
            $(this).removeClass('slideInUp' + ' animated')
        });
    }

    $scope.closePopUp = function () {

        $rootScope.popupMask = false;
        $('#me').addClass('slideOutDown' + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).hide();
            $(this).removeClass('slideOutDown' + ' animated')
        });
    }

    $scope.addPic = function () {
        $location.path("imgTag");
    }


    $scope.signout = 0;


    $scope.changeSignOut = function (value) {
        $scope.signout = value;
    }

    $scope.logOut = function () {
        $rootScope.popupMask = false;

        if (storeData.getData()['loginData'] && storeData.getData()['loginData']['loginType'] == 0) {

            var postData = {user_no: storeData.getData().loginData.user_details.user_no};
            var logout = localFactory.post('logout_user', postData);
            logout.success(function (data) {
                localFactory.unload();
                storeData.resetData();
                $location.path("/signup");
            });

            logout.error(function (data, status, headers, config) {
                localFactory.unload();
            });

        } else {

            $cordovaFacebook.logout()
                .then(function (success) {
                    storeData.resetData();
                    $location.path("/signup");
                }, function (error) {
                    // error
                });
        }
    }


    $scope.navigate = function (path) {
        $rootScope.popupMask = false;
        if (path == 'rate') {

        } else {
            $location.path(path);
        }

    }

    $scope.payment = function () {
        $rootScope.popupMask = false;
    }

    $scope.rateApp = function () {
        $rootScope.popupMask = false;
    }

}]);


app.controller('reportCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', '$cordovaCamera', '$cordovaFileTransfer', function ($rootScope, $scope, $location, localFactory, storeData, $cordovaCamera, $cordovaFileTransfer) {
    $scope.bookOnline = true;
    $scope.bookText = "Send my bug report";
    $scope.options = storeData.getData().loginData['bug_lising'];
    $scope.feedBackType = $scope.options[0];
    $scope.feedback = "";
    $scope.imageURI = "";
    $scope.happen_time = false;
    $scope.bookNow = function () {

        if ($scope.feedback == "") {
            localFactory.alert("Please enter description of bug.", function () {

            }, "Message", 'OK');
        }

        if ($scope.imageURI == "") {
            localFactory.alert("Please upload bug screen shot.", function () {

            }, "Message", 'OK');
        }

        if ($scope.feedback != "" && $scope.imageURI != '') {
            localFactory.load();
            var serverURL = 'http://ncrts.com/fishing_lake/webservice/send_bug_report';
            var options = new FileUploadOptions();
            options.fileKey = "lake_img";
            options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.user_no = storeData.getData().loginData.user_details.user_no;
            params.bug_details = $scope.feedback;
            params.happen_time = $scope.happen_time;
            params.bug_id = $scope.feedBackType['id'];
            options.params = params;

            $cordovaFileTransfer.upload(serverURL, $scope.imageURI, options)
                .then(function (result) {
                    localFactory.unload();
                    localFactory.alert('Bug posting successfully', function () {

                    }, "Message", 'OK');
                    $scope.feedback = "";
                    $scope.happen_time = false;
                    $scope.imageURI = "";

                }, function (err) {

                    console.log("error");
                    console.log(err);

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });
        }
    }


    $scope.toggleChecked = function () {

        if ($scope.happen_time) {

            $scope.happen_time = false;

        } else {

            $scope.happen_time = true;
        }
    }

    $scope.uploadImg = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.imageURI = imageURI;
        }, function (err) {
            console.log(err);
        });
    }

}]);

app.controller('contactCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', function ($rootScope, $scope, $location, localFactory, storeData) {
    $scope.bookOnline = true;
    $scope.bookText = "Send my message";

    $scope.options = storeData.getData().loginData['feedback_list'];
    $scope.feedBackType = $scope.options[0];
    $scope.info = "";

    $scope.bookNow = function () {
        if ($scope.info != "") {

            var postData = {user_no: storeData.getData().loginData.user_details.user_no, sub: $scope.feedBackType['type'], info: $scope.info};
            var logout = localFactory.post('contact_us', postData);
            logout.success(function (data) {
                localFactory.unload();
                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
                $scope.info = "";
            });

            logout.error(function (data, status, headers, config) {
                localFactory.unload();
            });
        }
    }

    $scope.callSupport = function () {
        document.location.href = "tel:0800 000 000";
    }

    $scope.openEmail = function () {
        window.location.href = "mailto:info@hotfishin.com?subject=Fishing App Feedback...";
    }

    $scope.openFb = function () {
        var ref = window.open('http://www.facebook.com', '_blank', 'location=no');
    }

}]);

app.controller('feedbackCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', function ($rootScope, $scope, $location, localFactory, storeData) {
    $scope.bookOnline = true;
    $scope.bookText = "Send my feedback";
    $scope.options = storeData.getData().loginData['feedback_list'];
    $scope.feedBackType = $scope.options[0];
    $scope.feedback = "";

    $scope.bookNow = function () {
        if ($scope.feedback != "") {
            var postData = {user_no: storeData.getData().loginData.user_details.user_no, feedback_id: $scope.feedBackType['id'], feedback: $scope.feedback};
            var logout = localFactory.post('send_feedback', postData);
            logout.success(function (data) {
                localFactory.unload();
                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');

                $scope.feedback = "";
            });

            logout.error(function (data, status, headers, config) {
                localFactory.unload();
            });

        }
    }
}]);

app.controller('suggestCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$cordovaCamera', 'storeData', '$cordovaGeolocation', '$cordovaFileTransfer', '$twitter', function ($rootScope, $scope, $location, localFactory, $cordovaCamera, storeData, $cordovaGeolocation, $cordovaFileTransfer, $twitter) {
    $scope.bookOnline = true;
    $scope.bookText = "Suggest this location";
    $scope.bookImg = "images/thumb.png";
    $scope.imageURI = "";
    $scope.lat = "";
    $scope.long = "";
    $scope.locationName = "";
    $scope.uploadImage = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.imageURI = imageURI;
        }, function (err) {
            console.log(err);
        });
    }


    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            $scope.lat = position.coords.latitude;
            $scope.long = position.coords.longitude;

            var latlng = new google.maps.LatLng($scope.lat, $scope.long);
            var mapOptions = {
                zoom: 15,
                center: latlng,
                minZoom: 10,
                zoomControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: false,
                scrollwheel: false

            };


            var map = new google.maps.Map(document.getElementById('map_canvas'),
                mapOptions);

            var destinationMarker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng($scope.lat, $scope.long),
                draggable: false
            });
            geocodePosition(destinationMarker.getPosition(),
                function (obj) {

                });
            var input = (document.getElementById('pac-input'));
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);
            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29)
            });

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                infowindow.close();
                marker.setVisible(false);
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);  // Why 17? Because it looks good.
                }

                destinationMarker.setPosition(place.geometry.location);
                var address = '';
                if (place.address_components) {

                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                    $scope.lat = place.geometry.location.lat();
                    $scope.long = place.geometry.location.lng();
                }
            });

        }, function (err) {
            alert(err);
        });


    function geocodePosition(pos, callBack) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            latLng: pos
        }, function (responses) {
            if (responses && responses.length > 0) {
                console.log(responses[0]);
                callBack.call(this, responses[0]);

            }
        });
    }

    $scope.resetAddress = function () {
        $scope.address = "";
        $scope.lat = "";
        $scope.long = "";
    }

    $scope.bookNow = function () {

        if ($scope.lat == "") {

            localFactory.alert("Select location Name.", function () {

            }, "Message", 'OK');
            return;
        }

        if ($scope.locationName == "") {
            localFactory.alert("Enter name of the lake.", function () {

            }, "Message", 'OK');
            return;
        }

        if ($scope.imageURI == "") {
            localFactory.alert("Please attach a image.", function () {

            }, "Message", 'OK');
            return;
        }


        if ($scope.imageURI != '') {

            var serverURL = 'http://ncrts.com/fishing_lake/webservice/suggest_lake';
            var options = new FileUploadOptions();
            options.fileKey = "lake_img";
            options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.user_no = storeData.getData().loginData.user_details.user_no;
            params.sugg_name = $scope.locationName;
            params.latitude = $scope.lat;
            params.longitude = $scope.long;
            options.params = params;
            localFactory.load();
            $cordovaFileTransfer.upload(serverURL, $scope.imageURI, options)
                .then(function (result) {
                    localFactory.unload();
                    if ($scope.twitter) {
                        if ($twitter.checkSession()) {
                            $twitter.tweet("I suggested location for fishing lake app " + $scope.locationName, function () {
                                window.history.back();
                            });
                        }
                    } else {
                        localFactory.alert("Please add twitter account in connect accounts.");
                    }
                    $location.path('home');
                    localFactory.alert('Location post successfully.', function () {

                    }, "Message", 'OK');

                    $scope.locationName = "";

                }, function (err) {
                    localFactory.unload();
                    console.log("error");
                    console.log(err);

                }, function (progress) {

                    console.log("constant progress updates");
                    console.log(progress);
                });
        }

    }

    $scope.twitter = false;
    $scope.fb = false;
    $scope.socialList =
        [
            {url: 'images/ico-twitter.png', id: 1, deactiveUrl: 'images/ico-twitter.png', activeUrl: 'images/ico-twitter-blue.png', flag: false},
            {url: 'images/ico-fb.png', id: 2, deactiveUrl: 'images/ico-fb.png', activeUrl: 'images/ico-fb-blue.png', flag: false}
        ]

    $scope.toggleSocial = function (value) {
        for (var i = 0; i < $scope.socialList.length; i++) {
            if (value.id == $scope.socialList[i]['id']) {
                if (value.flag) {
                    $scope.socialList[i]['url'] = $scope.socialList[i]['deactiveUrl'];

                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = false;
                    } else {
                        $scope.fb = false;
                    }
                    $scope.socialList[i]['flag'] = false;

                } else {

                    $scope.socialList[i]['url'] = $scope.socialList[i]['activeUrl'];
                    $scope.socialList[i]['flag'] = true;
                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = true;
                    } else {
                        $scope.fb = true;
                    }
                }
            }
        }
    }
}]);

app.controller('headerCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {

    $scope.openSearch = function (value) {
        $location.path("Search");
    }

    $scope.userRecentItems = function () {

        if (localFactory.getLocalItem('recent_items')) {

            $location.path("lakelist/recentitems");

        }
    }

    $scope.userBookItems = function () {

        $location.path("mybookmark");

    }

}]);

app.controller('tagImgCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', '$cordovaFileTransfer', '$cordovaCamera', '$twitter', function ($rootScope, $scope, $location, localFactory, $route, $cordovaFileTransfer, $cordovaCamera, $twitter) {
    $scope.bookOnline = true;
    $scope.bookText = "Done";
    $scope.bookImg = "images/ico-check-in.png";
    $scope.lackList = $route.current.locals.homeData.lake_cat_listing;
    $scope.imageURI = "images/user-photo.png";
    $scope.selectedCountry = "";
    $scope.bookNow = function () {

        console.log($scope.selectedCountry);
        if ($scope.selectedCountry == "" || $scope.selectedCountry == null) {

            localFactory.alert('Please select a lake.', function () {

            }, "Message", 'OK');

            return;
        }

        if ($scope.imageURI == "images/user-photo.jpg") {

            localFactory.alert('Please select a image.', function () {

            }, "Message", 'OK');
            return;
        }

        localFactory.load();
        var serverURL = 'http://ncrts.com/fishing_lake/webservice/post_lake_image';
        var options = new FileUploadOptions();
        options.fileKey = "lake_img";
        options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = {};
        params.lake_id = $scope.selectedCountry.originalObject.id;

        options.params = params;

        $cordovaFileTransfer.upload(serverURL, $scope.imageURI, options)
            .then(function (result) {
                localFactory.unload();
                console.log(result);
                if ($scope.twitter) {
                    if ($twitter.checkSession()) {
                        $twitter.tweet("I have add a photo of  " + $scope.selectedCountry.originalObject.lake_name, function () {
                            window.history.back();
                            localFactory.alert('Image tag successfully.', function () {

                            }, "Message", 'OK');
                            $scope.selectedCountry = "";
                            $scope.imageURI == "images/user-photo.png";
                        });
                    }
                } else {
                    localFactory.alert("Please add twitter account in connect accounts.");
                }
            }, function (err) {

                console.log("error");
                console.log(err);

            }, function (progress) {

                console.log("constant progress updates");
                console.log(progress);
            });

    }

    $scope.twitter = false;
    $scope.fb = false;

    $scope.socialList =
        [
            {url: 'images/ico-twitter.png', id: 1, deactiveUrl: 'images/ico-twitter.png', activeUrl: 'images/ico-twitter-blue.png', flag: false},
            {url: 'images/ico-fb.png', id: 2, deactiveUrl: 'images/ico-fb.png', activeUrl: 'images/ico-fb-blue.png', flag: false}
        ]

    $scope.toggleSocial = function (value) {
        for (var i = 0; i < $scope.socialList.length; i++) {
            if (value.id == $scope.socialList[i]['id']) {
                if (value.flag) {
                    $scope.socialList[i]['url'] = $scope.socialList[i]['deactiveUrl'];

                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = false;
                    } else {
                        $scope.fb = false;
                    }
                    $scope.socialList[i]['flag'] = false;

                } else {

                    $scope.socialList[i]['url'] = $scope.socialList[i]['activeUrl'];
                    $scope.socialList[i]['flag'] = true;
                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = true;
                    } else {
                        $scope.fb = true;
                    }
                }
            }
        }
    }


    $scope.uploadImage = function () {

        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {

            $scope.imageURI = imageURI;

        }, function (err) {
            console.log(err);
        });
    }

}]);


app.controller('ratingCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', '$twitter', function ($rootScope, $scope, $location, localFactory, storeData, $twitter) {

    /*show hide add review and */
    $scope.reviewData = "";
    $scope.showAddReview = false;

    $scope.lakeDetail = storeData.getData(true);

    $scope.addRating = function () {
        var postData = {lake_id: storeData.getData(true).currentLake.lake_category.id, user_no: storeData.getData().loginData.user_details.user_no, rate: $scope.rating};
        var bookMark = localFactory.post('post_review', postData);
        bookMark.success(function (data) {
            localFactory.unload();
            if (data.result) {
                if ($scope.twitter) {
                    if ($twitter.checkSession()) {
                        $twitter.tweet("I give a review on " + $scope.lakeDetail.lake_category.lake_name, function () {

                        });
                    }
                } else {
                    localFactory.alert("Please add twitter account in connect accounts.");
                }
            } else {

                localFactory.alert(data.msg, function () {

                }, "Message", 'OK');
            }
        });

        bookMark.error(function (data, status, headers, config) {

        });
    }

    $scope.addReview = function () {
        if ($scope.showAddReview) {
            if ($scope.reviewData != "") {
                var postData = {lake_id: storeData.getData(true).currentLake.lake_category.id, user_no: storeData.getData().loginData.user_details.user_no, review: $scope.reviewData, rate: $scope.rating};
                var bookMark = localFactory.post('post_review', postData);
                bookMark.success(function (data) {
                    localFactory.unload();
                    if (data.result) {
                        if ($scope.twitter) {
                            if ($twitter.checkSession()) {
                                $twitter.tweet("I give a review on" + $scope.lakeDetail.lake_category.leke_name, function () {

                                });
                            }
                        } else {
                            localFactory.alert("Please add twitter account in connect accounts.", function () {

                            }, "Message", 'OK');

                        }
                        var tempObj = {first_name: storeData.getData().loginData.user_details.first_name, last_name: storeData.getData().loginData.user_details.last_name, review: $scope.reviewData};
                        $scope.reviewList.push(tempObj);
                        $scope.showAddReview = false;
                        $scope.rightPanel = false; // filter out

                    } else {

                        localFactory.alert(data.msg, function () {

                        }, "Message", 'OK');
                    }
                });

                bookMark.error(function (data, status, headers, config) {

                });
            }
        } else {
            $scope.showAddReview = true;
        }

    }

    /* stars rating */
    $scope.rating = 1;
    $scope.rateFunction = function (rate) {
        $scope.rating = rate;
    };

    /*check box*/
    $scope.check = false;

    $scope.chengeCheck = function () {
        if ($scope.check) {
            $scope.check = false;
        } else {
            $scope.check = true;
        }
    }
    /*end of checkbox*/

    $scope.twitter = false;
    $scope.fb = false;
    $scope.socialList =
        [
            {url: 'images/ico-twitter.png', id: 1, deactiveUrl: 'images/ico-twitter.png', activeUrl: 'images/ico-twitter-blue.png', flag: false},
            {url: 'images/ico-fb.png', id: 2, deactiveUrl: 'images/ico-fb.png', activeUrl: 'images/ico-fb-blue.png', flag: false}
        ]

    $scope.toggleSocial = function (value) {
        for (var i = 0; i < $scope.socialList.length; i++) {
            if (value.id == $scope.socialList[i]['id']) {
                if (value.flag) {
                    $scope.socialList[i]['url'] = $scope.socialList[i]['deactiveUrl'];

                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = false;
                    } else {
                        $scope.fb = false;
                    }
                    $scope.socialList[i]['flag'] = false;

                } else {

                    $scope.socialList[i]['url'] = $scope.socialList[i]['activeUrl'];
                    $scope.socialList[i]['flag'] = true;
                    if ($scope.socialList[i]['id'] == 1) {
                        $scope.twitter = true;
                    } else {
                        $scope.fb = true;
                    }
                }
            }
        }
    }


}]);

app.controller('ticketDetails', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', function ($rootScope, $scope, $location, localFactory, storeData) {
    $scope.ticket = storeData.getData(true).currentTicket;
    console.log($scope.ticket);
}]);
