/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('homeCtrl',['$rootScope','$scope','$location','localFactory','homeservice','$timeout', function($rootScope,$scope,$location,localFactory,homeservice,$timeout){
    currentPage="homeCtrl";
    $scope.tabs = tabs;
    $scope.toggle = function (id) {
       var active=this.tab.active;
       var inactive=this.tab.inactive;
       this.tab.active=inactive;
       this.tab.inactive=active;
       this.tab.state = !this.tab.state;
       console.log($scope.tabs);
    };

    $scope.openSearch=function(value)
    {
        $location.path("Search");
    }

    $scope.listCollection=collection;

    $scope.viewDetail=function(value)
    {
        $location.path("lakelist");
    }

    $scope.openSearch=function(value)
    {
        $location.path("Search");
    }
}]);

app.controller('searchCtrl',['$rootScope','$scope','$location','localFactory','homeservice','$route', function($rootScope,$scope,$location,localFactory,homeservice,$route){
    currentPage="searchCtrl";
    $scope.tabs = tabs;

    $scope.filterOptions=[
        {
            id:1,
            name:"Fish Species",
            url:"images/ico-fish.png"
        },
        {
            id:2,
            name:"Accessibility",
            url:"images/ico-accessibility.png"
        },
        {
            id:3,
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

    $scope.showList=function(){
        $location.path("lakelist");
    }

    // filter data
    $scope.filterData=[{id:1,data:facilites},{id:2,data:fishingRules},{id:3,data:fishSpecies}];

    $scope.rightPanel=false;
    $scope.currentFilter=fishSpecies;
    $scope.showFilter=function(value)
    {
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
        $location.path("lakelist");
    }

    $scope.toggleItem=function(value,flag)
    {
        for(var i=0;i<$scope.currentFilter.length;i++)
        {
            if($scope.currentFilter[i].id==value.id)
            {
                if(flag)
                {
                    if($scope.currentFilter[i].specimen)
                    {
                        $scope.currentFilter[i].specimen=false;
                    }else{
                        $scope.currentFilter[i].specimen=true;
                    }
                }else{
                    if($scope.currentFilter[i].active)
                    {
                        $scope.currentFilter[i].active=false;

                    }else{

                        $scope.currentFilter[i].active=true;
                    }
                }
            }

        }
    }

}]);

app.controller('bookingCtrl',['$rootScope','$scope','$location','localFactory','$compile',"uiCalendarConfig","homeservice", function($rootScope,$scope,$location,localFactory,$compile,uiCalendarConfig,homeservice){
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
           $scope.date=date.toISODate();
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
                right: 'prev,next'
            },
            dayClick: $scope.alertOnEventClick
        }
    };

    $scope.currentTab=1;
    $scope.tabs=[
        {
            id:1,
            name:"Prices",
            active:"images/ico-pound-active.png",
            inactive:"images/ico-pound-inactive.png",
            url:"images/ico-pound-active.png"
        },
        {
            id:2,
            name:"Dates",
            inactive:"images/ico-cal-inactive.png",
            active:"images/ico-cal-active.png",
            url:"images/ico-cal-inactive.png"
        },
        {
            id:3,
            name:"Location",
            active:"images/ico-location-active.png",
            inactive:"images/ico-location-inactive.png",
            url:"images/ico-location-inactive.png"
        }
    ]

    $scope.tab = 1;

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
    }

}]);

app.controller('lakeListCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    currentPage="lakeListCtrl"
    $scope.lackList=lacks;

    $scope.lakeDetailView=function(value)
    {
        $location.path("lakeDetail/"+value);
    }
}]);


app.controller('lakeDetailCtrl',['$rootScope','$scope','$location','localFactory','$route','$routeParams', function($rootScope,$scope,$location,localFactory,$route,$routeParams){
    console.log($routeParams);
    $scope.lakeId=$routeParams.id;
    currentPage="lakeDetail";
    $scope.lackList=lacks;
    $scope.lakeDetail={};
    for(var i=0;i<$scope.lackList.length;i++)
    {
        if($scope.lackList[i]['id']==$route.current.params.id)
        {
            $scope.lakeDetail=$scope.lackList[i];
        }
    }

    $scope.showCheckIn=function()
    {
        $location.path("checkin");
    }

    $scope.showDirection=function()
    {

    }

    $scope.showReview=function()
    {
        $location.path("review");
    }

    $scope.showShare=function()
    {
        window.plugins.socialsharing.share('Message only');
    }

    $scope.showMorePhoto=function()
    {
        $location.path("photos");
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

app.controller('loginPageCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    $scope.submitForm = function() {
        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {

            $location.path("home");
        }
    };

}]);

app.controller('forgotPassCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){

    $scope.submitForm = function() {
        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            localFactory.alert("An email with instructions to reset password has been sent to your email address.",function(){

            },"Message",'OK');
        }
    };

}]);

app.controller('emailRegCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){

    $scope.submitForm = function() {
        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            console.log($scope.user);
            $location.path("home");
        }
    };

}]);

app.controller('signupCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){

    $scope.signupEmail=function()
    {
        $location.path("emailreg");
    }

}]);

app.controller('reviewsCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    $scope.bookOnline=true;
    $scope.bookText="Write a Review";
    $scope.bookImg="images/ico-writereview.png";
}]);

app.controller('photosCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
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

app.controller('footerCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    $scope.showList=function(){
        $location.path("lakelist");
    }
}]);

app.controller('headerCtrl',['$rootScope','$scope','$location','localFactory', function($rootScope,$scope,$location,localFactory){
    $scope.openSearch=function(value)
    {
        $location.path("Search");
    }
}]);