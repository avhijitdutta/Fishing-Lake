app.service('storeData', function () {
    var self = this;
    self.currentData = {loginData: ""};
    self.cityData = "";
    this.setData = function (obj) {
        if (obj.loginData) {
            var data = $.extend({}, obj.loginData);
            for (var i = 0; i < data.lake_amentites.length; i++) {
                data.lake_amentites[i]['active'] = false;

                data.lake_amentites[i]['id'] = data.lake_amentites[i]['amenitites_id']
            }

            for (var i = 0; i < data.lake_rules.length; i++) {
                data.lake_rules[i]['active'] = false;
            }

            for (var i = 0; i < data.lake_spacies.length; i++) {
                data.lake_spacies[i]['active'] = false;
                data.lake_spacies[i]['specimen'] = true;
            }
            self.currentData['loginData'] = data;
            console.log(self.currentData['loginData']);
        }
    }

    this.getData = function () {
        return this.currentData;
    }

    this.resetData = function () {

    }

});

app.service("paypal", function () {
    var self = this;
    this.paymentData = {
        amount: 0,
        currencyType: "USD",
        marchentName: "Test"
    }

    this.setData = function (obj) {
        self.paymentData = obj;
    }

    this.clientIDs = {
        "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
        "PayPalEnvironmentSandbox": "YOUR_SANDBOX_CLIENT_ID"
    };

    this.init = function () {

        PayPalMobile.init(self.clientIDs, self.onPayPalMobileInit);
    }


    this.onPayPalMobileInit = function () {
        //alert(JSON.stringify(self.configuration()));
        // must be called
        // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
        PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", self.configuration(),
            self.onPrepareRender);
    }

    this.onAuthorizationCallback = function (authorization) {
        console.log("authorization: " + JSON.stringify(authorization, null, 4));
    }

    this.createPayment = function () {
        // for simplicity use predefined amount
        var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
        var payment = new PayPalPayment(self.paymentData['amount'], self.paymentData['currencyType'], self.paymentData['marchentName'], "Sale",
            paymentDetails);
        return payment;
    }

    this.configuration = function () {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({
            merchantName: "My test shop",
            merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
            merchantUserAgreementURL: "https://mytestshop.com/agreement"
        });
        return config;
    }

    this.uiPayment = function (onSuccess, onCanceled) {
        // single payment
        PayPalMobile.renderSinglePaymentUI(self.createPayment(), onSuccess,
            onCanceled);
    }
});