app.service('homeservice', function(){
    var self=this;
    self.currentData={from:{id:"",city:""},to:{id:"",city:""},date:new Date(),bordingPoint:{name:"",id:""},noOfSeats:0,totalFare:0,tax:0,netAmount:0,currentBus:{},currentBusFare:0,bookSeats:[]};
    self.cityData="";
    this.setData=function(obj)
    {
        if(obj.from)
        {
            self.currentData.from=obj.from
        }

        if(obj.to)
        {
            self.currentData.to=obj.to
        }

        if(obj.date)
        {
            self.currentData.date=obj.date;
        }

        if(obj.bordingPoint)
        {
            self.currentData.bordingPoint=obj.bordingPoint;
        }

        if(obj.currentBus){
            self.currentData.currentBus=obj.currentBus;
        }

        if(obj.currentBusFare)
        {
            self.currentData.currentBusFare=obj.currentBusFare;
        }

        if(obj.noOfSeats)
        {
            self.currentData.noOfSeats=obj.noOfSeats;
            self.currentData.bookSeats=obj.bookSeats;

        }
    }

    this.getData=function()
    {
        return this.currentData;
    }

    this.resetData=function()
    {
        self.currentData['noOfSeats']=0;
        self.currentData['totalFare']=0;
        self.currentData['currentBus']={};
        self.currentData['currentBusFare']=0;
        self.currentData['bookSeats']=[];
    }

});

app.service("paypal",function()
{
    var self=this;
    this.paymentData={
        amount:0,
        currencyType:"USD",
        marchentName:"Test"
    }

    this.setData=function(obj){
        self.paymentData=obj;
    }

    this.clientIDs = {
        "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
        "PayPalEnvironmentSandbox": "YOUR_SANDBOX_CLIENT_ID"
    };

    this.init=function(){

        PayPalMobile.init(self.clientIDs, self.onPayPalMobileInit);
    }


    this.onPayPalMobileInit=function(){
        //alert(JSON.stringify(self.configuration()));
        // must be called
        // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
        PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", self.configuration(),
            self.onPrepareRender);
    }

    this.onAuthorizationCallback=function(authorization) {
        console.log("authorization: " + JSON.stringify(authorization, null, 4));
    }

    this.createPayment=function() {
        // for simplicity use predefined amount
        var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
        var payment = new PayPalPayment(self.paymentData['amount'],self.paymentData['currencyType'],self.paymentData['marchentName'], "Sale",
            paymentDetails);
        return payment;
    }

    this.configuration=function() {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({
            merchantName: "My test shop",
            merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
            merchantUserAgreementURL: "https://mytestshop.com/agreement"
        });
        return config;
    }

    this.uiPayment=function(onSuccess,onCanceled){
        // single payment
        PayPalMobile.renderSinglePaymentUI(self.createPayment(), onSuccess,
            onCanceled);
    }
});