/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('homeCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$timeout', '$route', function ($rootScope, $scope, $location, localFactory, $timeout, $route) {

    console.log(tabs);
    currentPage="homeCtrl";
    $scope.tabs = tabs;
    $scope.toggle = function (id) {
       var active=this.tab.active;
       var inactive=this.tab.inactive;
       this.tab.active=inactive;
       this.tab.inactive=active;
       this.tab.state = !this.tab.state;
    };

    $scope.openSearch=function(value)
    {
        $location.path("Search");
    }

    $scope.listCollection = $route.current.locals.homeData.lake_category;

    $scope.viewDetail=function(value)
    {
        $location.path("lakelist/" + value);
    }

    $scope.quickSearch = function (value) {
        $location.path("lakelist/adsearch");
    }

    $scope.openSearch=function(value)
    {
        $location.path("Search");
    }
}]);

app.controller('searchCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', 'storeData', function ($rootScope, $scope, $location, localFactory, $route, storeData) {
    currentPage="searchCtrl";

    $scope.is_search = true;

    $scope.tabs = tabs;

    $scope.filterOptions=[
        {
            id: 3,
            name:"Fish Species",
            url:"images/ico-fish.png"
        },
        {
            id: 1,
            name:"Accessibility",
            url:"images/ico-accessibility.png"
        },
        {
            id: 2,
            name:"Fishing Rules",
            url:"images/ico-ts.png"
        }
    ]

    $scope.toggle = function (id) {
        var active=this.tab.active;
        var inactive=this.tab.inactive;
        this.tab.active=inactive;
        this.tab.inactive=active;
        this.tab.state = !this.tab.state;
    };

    // filter data
    $scope.filterData =
    {
        1: {data: storeData.getData().loginData.lake_amentites, name: 'amentites', value: 'Accessibility'},
        2: {data: storeData.getData().loginData.lake_rules, name: 'rules', value: 'Fishing Rules'},
        3: {data: storeData.getData().loginData.lake_spacies, name: 'spacies', value: 'Fish Species'}
    };
    console.log($scope.filterData);

    $scope.showList=function(){

        $location.path("lakelist/advanceSearch");
    }

    $scope.rightPanel=false;
    $scope.currentFilter = "";
    $scope.showFilter=function(value)
    {
        $scope.currentFilter = $scope.filterData[value];
        if($scope.rightPanel)
        {
            $scope.rightPanel=false;

        }else{

            $scope.rightPanel=true;
        }
    }

    // filter click function
    $scope.hideRightPanel=function(value)
    {
        $scope.rightPanel=false; // filter out
    }

    $scope.bookOnline=true;
    $scope.bookText="Search";
    $scope.bookImg="";

    /**** search list page****/
    $scope.bookNow=function()
    {
        $location.path("lakelist/adsearch");
    }

    $scope.toggleItem=function(value,flag)
    {
        for (var i = 0; i < $scope.currentFilter['data'].length; i++)
        {
            if ($scope.currentFilter['data'][i].id == value.id)
            {
                if(flag)
                {
                    if ($scope.currentFilter['data'][i].specimen)
                    {
                        $scope.currentFilter['data'][i].specimen = false;
                    }else{
                        $scope.currentFilter['data'][i].specimen = true;
                    }
                }else{
                    if ($scope.currentFilter['data'][i].active)
                    {
                        $scope.currentFilter['data'][i].active = false;

                    }else{

                        $scope.currentFilter['data'][i].active = true;
                    }
                }
            }

        }
    }
}]);

app.controller('bookingCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$compile', "uiCalendarConfig", function ($rootScope, $scope, $location, localFactory, $compile, uiCalendarConfig) {
    currentPage="bookingCtrl";
    $scope.date="None Selected";
    $scope.totalPrice=0;
    $scope.ticket="";
    $scope.alertOnEventClick=function(date, jsEvent, view)
    {
        var today=new Date();
        var formattedDate = new Date(date);
        if(formattedDate.setHours(0,0,0,0)>=today.setHours(0,0,0,0))
        {
            $scope.date = date.toISODate();
            if ($scope.date != "None Selected" && $scope.ticket != "") {
                $scope.bookOnline = true;
            }
        }else{

            localFactory.alert("You can't choose previous date ",function()
            {

            },"Alert","Ok");
        }
    }

    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 200,
            editable: true,
            header:{
                left: 'title',
                center: '',
                right: 'next'
            },
            dayClick: $scope.alertOnEventClick
        }
    };

    $scope.tab = 1;

    $scope.arrPrices=[
        {id:1,name:"Day",price:6,qty:0,totalPrice:0},
        {id:2,name:"Child (under 16 )",price:3,qty:0,totalPrice:0}
    ]

    $scope.qtyPlusMin=function(id,sign){
        $scope.ticket="";
        $scope.totalPrice=0;
        for(var i=0;i<$scope.arrPrices.length;i++)
        {
            if($scope.arrPrices[i]['id']==id)
            {
                if(sign==1)
                {
                    $scope.arrPrices[i]['qty']=$scope.arrPrices[i]['qty']+1;
                }else
                {
                    if($scope.arrPrices[i]['qty']>0)
                    {
                        $scope.arrPrices[i]['qty']=$scope.arrPrices[i]['qty']-1;
                    }
                }
                $scope.arrPrices[i]['totalPrice']=$scope.arrPrices[i]['qty']*$scope.arrPrices[i]['price'];
            }
            $scope.totalPrice=parseFloat($scope.arrPrices[i]['totalPrice']+$scope.totalPrice).toFixed(2);
            if($scope.arrPrices[i]['qty']>0)
            {
                $scope.ticket+=$scope.arrPrices[i]['name']+" "+$scope.arrPrices[i]['qty'];
                if($scope.arrPrices[i+1]['qty']>0)
                {
                    $scope.ticket+=","
                }
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
        $location.path("confirm");
    }
}]);

app.controller('lakeListCtrl', ['$rootScope', '$scope', '$location', 'localFactory', "$route", 'storeData', function ($rootScope, $scope, $location, localFactory, $route, storeData) {
    currentPage = "lakeListCtrl";
    $scope.lackList = $route.current.locals.homeData.lake_cat_listing;
    $scope.lakeDetailView=function(value)
    {

        $location.path("lakeDetail/"+value);
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


app.controller('lakeDetailCtrl',['$rootScope','$scope','$location','localFactory','$route','$routeParams', function($rootScope,$scope,$location,localFactory,$route,$routeParams){

    $scope.lakeId=$routeParams.id;
    currentPage="lakeDetail";

    // store data in local storage in recent items
    $scope.recentItems = {value: []};
    if (localFactory.getLocalItem('recent_items')) {
        $scope.recentItems = $.parseJSON(localFactory.getLocalItem('recent_items'));
        if ($.inArray($scope.lakeId, $scope.recentItems) < 0) {
            $scope.recentItems['value'].push($scope.lakeId);
            localFactory.setLocalItem('recent_items', JSON.stringify($scope.recentItems));
        }

    }
    else {
        $scope.recentItems['value'].push($scope.lakeId);
        localFactory.setLocalItem('recent_items', JSON.stringify($scope.recentItems));
    }

    console.log(localFactory.getLocalItem('recent_items'));

    $scope.lakeDetail = "";
    if ($route.current.locals.homeData.result)
    {
        $scope.lakeDetail = $route.current.locals.homeData.lake_category[0];

        if ($scope.lakeDetail.fav_id == "") {

            $scope.lakeDetail.fav_id = false;
        } else {

            $scope.lakeDetail.fav_id = true;
        }
    }

    $scope.showCheckIn=function()
    {
        $location.path("checkin");
    }

    $scope.showDirection=function()
    {

    }

    $scope.showReview = function (id)
    {
        $location.path("review/" + id);
    }

    $scope.showShare=function()
    {
        window.plugins.socialsharing.share('Message only');
    }

    $scope.showMorePhoto = function (id)
    {
        $location.path("photos/" + id);
    }


    $scope.bookNow=function()
    {
        $location.path("booking");
    }

    $scope.showOwner=function()
    {
        $location.path("owner");
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

    $scope.lake_venue = "";
    $scope.lake_pricing = [];
    $scope.lake_timing = [];
    $scope.lake_image = [];
    $scope.lake_review = [];
    $scope.other_lake = [];
    var postData = {lake_id: $scope.lakeDetail.id};
    //function to 'open' a tab
    $scope.openTab = function (tab) {
        switch (tab) {
            case 1:
                if ($scope.lake_venue == "") {

                    var lakePricing = localFactory.post('lake_venue', postData);
                    lakePricing.success(function (data) {
                        console.log(data);
                        localFactory.unload();
                        if (data.result) {
                            $scope.lake_venue = data;
                        } else {
                            localFactory.alert(data.msg, function () {

                            }, "Message", 'OK');
                        }
                    });

                    lakePricing.error(function (data, status, headers, config) {

                    });
                }
                break;
            case 2:
                if ($scope.lake_pricing.length < 1) {
                    var lakePricing = localFactory.post('lake_pricing', postData);
                    lakePricing.success(function (data) {
                        console.log(data);
                        localFactory.unload();
                        if (data.result) {
                            $scope.lake_pricing = data.lake_pricing;
                        } else {
                            localFactory.alert(data.msg, function () {

                            }, "Message", 'OK');
                        }
                    });

                    lakePricing.error(function (data, status, headers, config) {

                    });
                }
                break;
            case 3:
                if ($scope.lake_image.length < 1) {
                    var lakeTimeing = localFactory.post('lake_timing', postData);
                    lakeTimeing.success(function (data) {
                        console.log(data);
                        localFactory.unload();
                        if (data.result) {
                            $scope.lake_timing = data.lake_timing;
                        } else {
                            localFactory.alert(data.msg, function () {

                            }, "Message", 'OK');
                        }
                    });

                    lakeTimeing.error(function (data, status, headers, config) {

                    });
                }
                break;
            case 4:

                break;
            case 5:
                if ($scope.lake_review.length < 1) {
                    var lakeTimeing = localFactory.post('review', postData);
                    lakeTimeing.success(function (data) {
                        console.log(data);
                        localFactory.unload();
                        if (data.result) {
                            $scope.lake_review = chunk(data.lake_review, 2);
                            console.log($scope.lake_review);
                        } else {
                            localFactory.alert(data.msg, function () {

                            }, "Message", 'OK');
                        }
                    });

                    lakeTimeing.error(function (data, status, headers, config) {

                    });
                }

                break;
            case 6:

                if ($scope.lake_image.length < 1) {
                    var lakeTimeing = localFactory.post('lake_image', postData);
                    lakeTimeing.success(function (data) {
                        console.log(data);
                        localFactory.unload();
                        if (data.result) {
                            $scope.lake_image = chunk(data.lake_image, 4);
                            console.log($scope.lake_image);
                        } else {
                            localFactory.alert(data.msg, function () {

                            }, "Message", 'OK');
                        }
                    });

                    lakeTimeing.error(function (data, status, headers, config) {

                    });
                }


                break;
            case 7:
                if ($scope.other_lake.length < 1) {
                    var lakeTimeing = localFactory.post('other_lake', postData);
                    lakeTimeing.success(function (data) {
                        console.log(data);
                        localFactory.unload();
                        if (data.results) {
                            $scope.other_lake = chunk(data.other_lake, 4);
                            console.log($scope.other_lake);
                        } else {
                            localFactory.alert(data.msg, function () {

                            }, "Message", 'OK');
                        }
                    });

                    lakeTimeing.error(function (data, status, headers, config) {

                    });
                }

        }


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

    // Ask a question
    $scope.askquestion = "";
    $scope.postFaq = function () {
        if ($scope.askquestion != "") {
            var postData = {lake_id: $scope.lakeDetail.id, user_no: 2, faq: $scope.askquestion};
            var lakeTimeing = localFactory.post('post_faq', postData);
            lakeTimeing.success(function (data) {
                console.log(data);
                localFactory.unload();
                if (data.result) {

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

        var postData = {lake_id: $scope.lakeDetail.id, user_no: 2};
        var bookMark = localFactory.post('favorite_lake', postData);
        bookMark.success(function (data) {
            localFactory.unload();
            if (data.result) {

                if (data.is_fev) {

                    $scope.lakeDetail.fav_id = true;

                } else {

                    $scope.lakeDetail.fav_id = false;
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

    $scope.bookOnline=true;
    $scope.bookText="Book Online Now";
    $scope.bookImg="";
    /*filter*/

    $scope.rightPanel=false;
    $scope.showRate=function()
    {
        $scope.showAddReview=false;
        if($scope.rightPanel)
        {
            $scope.rightPanel=false;

        }else{

            $scope.rightPanel=true;
        }
    }

    // filter click function
    $scope.hideRightPanel=function(value)
    {
        $scope.rightPanel=false; // filter out
    }

    /*show hide add review and */
    $scope.showAddReview=false;
    $scope.addReview=function(){
        if($scope.showAddReview)
        {
            $scope.showAddReview=false;
            $scope.rightPanel=false; // filter out
        }else{
            $scope.showAddReview=true;
        }

    }

    /* stars rating */
    $scope.rating =1;
    $scope.rateFunction = function(rating) {
        console.log(rating);
    };

    /*check box*/
    $scope.check=false;

    $scope.chengeCheck=function(){
        if($scope.check)
        {
            $scope.check=false;
        }else{
            $scope.check=true;
        }
    }
    /*end of checkbox*/

    $scope.currentTab=1;
    $scope.tabs=[
        {
            id:1,
            name:"Amenities",
            active:"images/ico-amenities-inactive.png",
            inactive:"images/ico-amenities.png",
            url:"images/ico-amenities.png"
        },
        {
            id:2,
            name:"Fishing Rules",
            inactive:"images/ico-ts-active.png",
            active:"images/ico-ts-inactive.png",
            url:"images/ico-ts-inactive.png"
        },
        {
            id:3,
            name:"Fish Species",
            active:"images/ico-coarse-inactive.png",
            inactive:"images/ico-coarse-active.png",
            url:"images/ico-coarse-active.png"
        }
    ]

    $scope.tab = 2;

    $scope.setTab = function (tab) {
        $scope.tab=tab.id;
        for(i=0;i<$scope.tabs.length;i++)
        {
            if($scope.tab==$scope.tabs[i].id)
            {
                $scope.tabs[i].url= $scope.tabs[i].active;
            }else{
                $scope.tabs[i].url= $scope.tabs[i].inactive;
            }
        }
    };

    $scope.isSet = function (active) {
        return active.id == $scope.tab;
    };

    $scope.prices=100;

    $scope.socialList=[
        {url:'images/ico-twitter.png',id:1,deactiveUrl:'images/ico-twitter.png',activeUrl:'images/ico-twitter-blue.png',flag:false},
        {url:'images/ico-fb.png',id:2,deactiveUrl:'images/ico-fb.png',activeUrl:'images/ico-fb-blue.png',flag:false}
    ]

    $scope.toggleSocial=function(value){
        for(var i=0;$scope.socialList.length;i++)
        {
            if(value.id==$scope.socialList[i]['id'])
            {
                if(value.flag)
                {
                    $scope.socialList[i]['url']=$scope.socialList[i]['deactiveUrl'];
                    $scope.socialList[i]['flag']=false;

                }else{

                    $scope.socialList[i]['url']=$scope.socialList[i]['activeUrl'];
                    $scope.socialList[i]['flag']=true;
                }
            }
        }
    }

}]);

app.controller('loginPageCtrl', ['$rootScope', '$scope', '$location', 'localFactory', 'storeData', function ($rootScope, $scope, $location, localFactory, storeData) {
    $scope.submitForm = function() {

        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            console.log($scope.user);
            var postData = $scope.user;
            localFactory.load();
            var login = localFactory.post('login', postData);
            login.success(function (data) {
                localFactory.unload();

                if (data.result) {

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

            localFactory.alert("Please Enter Valid User ID", function () {

            }, "Message", 'OK');
        }
    };

}]);

app.controller('forgotPassCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){

    $rootScope.enterAnimation = "slideLeft";
    $rootScope.exitAnimation = "slideRight";

    $scope.submitForm = function() {
        // check to make sure the form is completely valid
        alert($scope.userForm.$valid);
        if ($scope.userForm.$valid) {

            console.log($scope.user);
            var postData = $scope.user;
            localFactory.load();
            var forgot = localFactory.post('forget_password', postData);
            forgot.success(function (data) {
                console.log(data);

                localFactory.unload();

                localFactory.alert("An email with instructions to reset password has been sent to your email address.", function () {

                }, "Message", 'OK');

            });
            forgot.error(function (data, status, headers, config) {
                localFactory.unload();
            });


        } else {

            localFactory.alert("Enter valid email id", function () {

            },"Message",'OK');
        }
    };

}]);

app.controller('emailRegCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){

    $scope.submitForm = function() {
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
                    $location.path("home");
                }

            });

            signup.error(function (data, status, headers, config) {
                localFactory.unload();
            });


        }
    };

}]);

app.controller('signupCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){

    $scope.signupEmail=function()
    {
        $location.path("emailreg");
    }

}]);

app.controller('reviewsCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', function ($rootScope, $scope, $location, localFactory, $route) {
    $scope.review = [];
    if ($route.current.locals.homeData.result) {
        $scope.review = $route.current.locals.homeData.lake_review;
    }
    $scope.bookOnline=true;
    $scope.bookText="Write a Review";
    $scope.bookImg="images/ico-writereview.png";
}]);

app.controller('photosCtrl', ['$rootScope', '$scope', '$location', 'localFactory', '$route', function ($rootScope, $scope, $location, localFactory, $route) {

    console.log($route.current.locals.homeData);
    $scope.lake_image = [];
    if ($route.current.locals.homeData.result) {

        $scope.lake_image = $route.current.locals.homeData.lake_image;
    }
    console.log($scope.lake_image);
    $scope.bookOnline=true;
    $scope.bookText="Upload Photos";
    $scope.bookImg="images/ico-upload.png";
}]);

app.controller('checkinCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    $scope.bookOnline=true;
    $scope.bookText="Check In";
    $scope.bookImg="images/ico-check-in.png";



    $scope.bookNow=function(){

        window.history.back();
    }

    $scope.socialList=[
        {url:'images/ico-twitter.png',id:1,deactiveUrl:'images/ico-twitter.png',activeUrl:'images/ico-twitter-blue.png',flag:false},
        {url:'images/ico-fb.png',id:2,deactiveUrl:'images/ico-fb.png',activeUrl:'images/ico-fb-blue.png',flag:false}
    ]

    $scope.toggleSocial=function(value){
        for(var i=0;$scope.socialList.length;i++)
        {
            if(value.id==$scope.socialList[i]['id'])
            {
                if(value.flag)
                {
                    $scope.socialList[i]['url']=$scope.socialList[i]['deactiveUrl'];
                    $scope.socialList[i]['flag']=false;

                }else{

                    $scope.socialList[i]['url']=$scope.socialList[i]['activeUrl'];
                    $scope.socialList[i]['flag']=true;
                }
            }
        }
    }

}]);

app.controller('lakeOwner',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){

    $scope.showPrev=function(){

        $location.path("lakeDetail/owner");
    }

    $scope.emptyInput=function($event){

        $($event.currentTarget).prev().val("");
    }

    $scope.vanueAdd=[
        {name:"Street"},
        {name:"Street1"},
        {name:"City"},
        {name:"Country"},
        {name:"Post"}
    ];

    $scope.vanueAddModel={};

    $scope.updateVenue=function($event)
    {

        //$scope.updateColor($event.target);
    }

    $scope.facilites=facilites;

    $scope.fishingRules=fishingRules;

    $scope.fishSpecies=fishSpecies;
    $scope.itemActive=function(item,facilites)
    {
        var length=facilites.length;
        for(var i=0;i<length;i++)
        {
            if(facilites[i].id==item.id)
            {
                if(item.active)
                {
                    facilites[i].active=false;

                }else
                {
                    facilites[i].active=true;
                }
            }
        }
    }

    $scope.itemToggle=function(item,fishSpecies)
    {
        var length=fishSpecies.length;
        for(var i=0;i<length;i++)
        {
            if(fishSpecies[i].id==item.id)
            {
                if(item.specimen)
                {
                    fishSpecies[i].specimen=false;

                }else
                {
                    fishSpecies[i].specimen=true;
                }
            }
        }
    }

    /* prices add and update in a lake*/
    $scope.pricesArr=[
        {name:"24 Hour",val:10,id:1},
        {name:"Night",val:20,id:2},
        {name:"Children",val:30,id:3},
        {name:"OAP",val:40,id:4},
        {name:"Students",val:50,id:5}
    ];

    /*filter*/

    $scope.rightPanel=false;

    // filter click function
    $scope.hideRightPanel=function(value)
    {
        $scope.rightPanel=false; // filter out
        $scope.rightPanelAddMember=false;

    }// filter click function


    //update fish
    $scope.updateFish=function(fishObj)
    {
        for(var i=0;i<$scope.pricesArr.length;i++)
        {
            if($scope.pricesArr[i].id==fishObj.id)
            {
                $scope.pricesArr.removeValue('id',fishObj.id);
            }
        }
    }

    //rightPanelAddMember
    $scope.rightPanelAddMember=false;
    $scope.showAddBox=function()
    {
        if($scope.rightPanelAddMember)
        {
            $scope.rightPanelAddMember=false;
            $scope.rightPanel=false;

        }else{
            $scope.rightPanelAddMember=true;
            $scope.rightPanel=true;
        }
    }

    //right panel open clock

    $scope.days=[
        {name:"Monday",Opening:{hours:08,minutes:10,midday:"AM"},Closing:{hours:08,minutes:10,midday:"AM"},close:false},
        {name:"Tuesday",Opening:{hours:08,minutes:00,midday:"AM"},Closing:{hours:08,minutes:00,midday:"AM"},close:false},
        {name:"Wednesday",Opening:{hours:08,minutes:00,midday:"AM"},Closing:{hours:08,minutes:00,midday:"AM"},close:false},
        {name:"Thursday",Opening:{hours:08,minutes:00,midday:"AM"},Closing:{hours:08,minutes:00,midday:"AM"},close:false},
        {name:"Friday",Opening:{hours:08,minutes:00,midday:"AM"},Closing:{hours:08,minutes:00,midday:"AM"},close:true},
        {name:"Saturday",Opening:{hours:08,minutes:00,midday:"AM"},Closing:{hours:08,minutes:00,midday:"AM"},close:false},
        {name:"Sunday",Opening:{hours:08,minutes:00,midday:"AM"},Closing:{hours:08,minutes:00,midday:"AM"},close:false}
    ]


    $scope.rightPanelTime=false;
    $scope.selectedTime={};
    $scope.addTime=function(days,isOpening)
    {
        if(isOpening)
        {
            $scope.selectedTime=days.Opening;
        }
        else{
            $scope.selectedTime=days.Closing;
        }

        if($scope.rightPanelTime)
        {
            $scope.rightPanelTime=false;

        }else{

            $scope.rightPanelTime=true;
        }
    }

    $scope.hidePanelTime=function()
    {
        $scope.rightPanelTime=false;
    }

    $scope.increseTime=function(isHours,isPlus)
    {

        if(isHours)
        {
            if(isPlus)
            {
                $scope.selectedTime.hours=$scope.selectedTime.hours + 1;
                if($scope.selectedTime.hours>12)
                {
                    $scope.selectedTime.hours=$scope.selectedTime.hours-12;
                }
            }
            else
            {
                $scope.selectedTime.hours=$scope.selectedTime.hours - 1;
                if($scope.selectedTime.hours<0)
                {
                    $scope.selectedTime.hours=12;
                }
            }

        }else{

            if(isPlus) {
                $scope.selectedTime.minutes= $scope.selectedTime.minutes + 1;
                if($scope.selectedTime.minutes>60)
                {
                    $scope.selectedTime.minutes=$scope.selectedTime.minutes-60;
                }
            }
            else{
                $scope.selectedTime.minutes=$scope.selectedTime.minutes - 1;
                if($scope.selectedTime.minutes<0)
                {
                    $scope.selectedTime.minutes=60;
                }
            }
        }

    }

    // midday change
    $scope.changeMidday=function()
    {
        if($scope.selectedTime.midday=="AM")
        {
            $scope.selectedTime.midday="PM";

        }else{
            $scope.selectedTime.midday="AM";
        }
    }

    //update contact details
    $scope.contactDetail=[
        {name:"Contact Person",type:"text"},
        {name:"Contact Number",type:"tel"},
        {name:"Email",type:"email"}
    ];

    $scope.contactDetailModel={};

    $scope.updateContactDetail=function()
    {
        console.log($scope.contactDetailModel);
    }

    $scope.updateOpening=function()
    {
        console.log($scope.contactDetailModel);
    }
    //end of contact details model

    //right panel add another lake
    $scope.rightPanelLake=false;
    $scope.showRightLake=function()
    {
        if($scope.rightPanelLake)
        {
            $scope.rightPanelLake=false;

        }else{

            $scope.rightPanelLake=true;
        }
    }

    $scope.hidePanelLake=function()
    {
        if($scope.rightPanelLake)
        {
            $scope.rightPanelLake=false;

        }else{

            $scope.rightPanelLake=true;
        }
    }

    //owner lake photo
    $scope.photoList=[
        {id:1,url:"images/thumb-pic.jpg"},
        {id:2,url:"images/thumb-pic.jpg"},
        {id:3,url:"images/thumb-pic.jpg"},
        {id:4,url:"images/thumb-pic.jpg"},
        {id:5,url:"images/thumb-pic.jpg"},
        {id:6,url:"images/thumb-pic.jpg"},
        {id:7,url:"images/thumb-pic.jpg"}
    ];

    // lake list search
    $scope.removePhoto=function(value)
    {
        $scope.photoList.removeValue('id',value.id);
    }

    $scope.uploadImage=function()
    {

    }

    //lakelist details
    $scope.nearByLacks=[
        {id:1,name:"Himley Hall Pool",is_claim:false,added:true,can_add:false,claim_already:false},
        {id:2,name:"Himley Hall bottom lake",is_claim:false,added:false,can_add:true,claim_already:false},

        {id:3,name:"Bradley Farm Fishing Lake",is_claim:false,added:false,can_add:false,claim_already:true},
        {id:4,name:"Swansen View Pool",is_claim:false,added:false,can_add:false,claim_already:true},

        {id:5,name:"Woodgrove Farm",is_claim:true,added:false,can_add:false,claim_already:false},
        {id:6,name:"Top-hill River cabin",is_claim:true,added:false,can_add:false,claim_already:false},
        {id:7,name:"Crossing Pond (upton)",is_claim:true,added:false,can_add:false,claim_already:false}
    ]

    // for show claim box
    $scope.showClaimForm=false;

    $scope.showClaimBox=function()
    {
        $scope.showClaimForm=true;
    }

    //update claimlake detail and model
    $scope.claimLakeDetails=[
        {name:"Email",type:"email",placeHolder:"Enter your email address"},
        {name:"Name",type:"text",placeHolder:"Your name"},
        {name:"phone",type:"tel",placeHolder:"Contact phone no"}
    ];

    $scope.claimLakeModel={};

    $scope.claimLakeUpdate=function()
    {
        $scope.showClaimForm=false;
        console.log($scope.claimLakeModel);
    }

    $scope.addLake=function(item){
        for(var i=0;i<$scope.nearByLacks.length;i++)
        {
            if($scope.nearByLacks[i]['id']==item.id)
            {
                $scope.nearByLacks[i]['can_add']=false;
                $scope.nearByLacks[i]['added']=true;
                break;
            }
        }
    }

    $scope.updateLakeName=function($event)
    {
        $scope.updateColor($event.target);
    }

    $scope.updateColor=function(event){
        angular.element(event).removeClass('btn-update');
        angular.element(event).addClass('btn-updated');
        $(event).find('img').attr("src", 'images/ico-tick-bgreen.png');
    }

    $scope.updateDesc=function($event)
    {
        //$scope.updateColor($event.target);
    }

}]);

app.controller('ticketBookCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {
    $scope.backHome = function () {
        $location.path("home");
    }

    $scope.rateApp = function () {

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
        $location.path("booking");
    }

}]);

app.controller('myTicketCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {
    $scope.tab = 1;
    $scope.futureTicket = function () {
        $scope.tab = 2;
    }

    $scope.pastTicket = function () {
        $scope.tab = 1;
    }

}]);

app.controller('connectAccCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {

}]);


app.controller('footerCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    $scope.showList=function(){
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
        {id: 3, name: 'My Tickets', goto: 'mytickets'}
    ];
    $scope.moreList = [
        {id: 1, name: 'Send Feedback', goto: 'sendFeedback'},
        {id: 2, name: 'Contact us', goto: 'contactus'},
        {id: 3, name: 'Report a bug', goto: 'reportBug'},
        {id: 4, name: 'Suggest a location', goto: 'suggestLocation'}
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

            $rootScope.popupMask = false;
            $location.path("lakelist/nearby");

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
        var pictureSource = navigator.camera.PictureSourceType;
        var destinationType = navigator.camera.DestinationType;
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80, correctOrientation: true, sourceType: pictureSource.SAVEDPHOTOALBUM});
        function onPhotoDataSuccess(imageData) {

        }

        function onFail(message) {
            //alert('Failed to load picture because: ' + message);
        }
    }


    $scope.signout = 0;

    $scope.logOut = function () {
        $rootScope.popupMask = false;
        $location.path("/");
    }


    $scope.navigate = function (path) {
        $rootScope.popupMask = false;
        $location.path(path);
    }

    $scope.payment = function () {
        $rootScope.popupMask = false;
    }

    $scope.rateApp = function () {
        $rootScope.popupMask = false;
    }

}]);


app.controller('reportCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {
    $scope.bookOnline = true;
    $scope.bookText = "Send my bug report";
}]);

app.controller('contactCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {
    $scope.bookOnline = true;
    $scope.bookText = "Send my message";
}]);

app.controller('feedbackCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {
    $scope.bookOnline = true;
    $scope.bookText = "Send my feedback";
}]);

app.controller('suggestCtrl', ['$rootScope', '$scope', '$location', 'localFactory', function ($rootScope, $scope, $location, localFactory) {
    $scope.bookOnline = true;
    $scope.bookText = "Suggest this location";
    $scope.bookImg = "images/thumb.png";
}]);

app.controller('headerCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    $scope.openSearch=function(value)
    {
        $location.path("Search");
    }

    $scope.userRecentItems = function () {

        if (localFactory.getLocalItem('recent_items')) {
            $location.path("lakelist/recentitems");
        } else {

        }
    }

    $scope.userBookItems = function () {

        $location.path("mybookmark");

    }

}]);