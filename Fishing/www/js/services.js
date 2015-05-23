app.service('storeData', ['localFactory', function (localFactory) {
    var self = this;
    self.currentData = {loginData: "", currentLake: {}, latLong: {}, currentBooking: {}, currentTicket: {}};
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
            localFactory.setLocalItem('loginData', JSON.stringify(self.currentData));
        }

        if (obj.currentLake) {

            self.currentData['currentLake'] = obj.currentLake;
        }

        if (obj.latLong) {
            self.currentData['latLong'] = obj.latLong;
        }

        if (obj.currentBooking) {

            self.currentData['currentBooking'] = obj.currentBooking;
        }

        if (obj.currentTicket) {
            self.currentData['currentTicket'] = obj.currentTicket;
        }
        if (obj.social) {
            localFactory.setLocalItem('social', JSON.stringify(obj.social));
        }
    }


    this.getData = function (value) {

        if (value) {
            return  self.currentData;

        } else {
            return $.parseJSON(localFactory.getLocalItem('loginData'));
        }
    }

    this.getSocialData = function () {
        return $.parseJSON(localFactory.getLocalItem('social'));
    }

    this.resetData = function () {

        localFactory.setLocalItem('loginData', '');
    }


}]);

app.service('ajaxSearch', ['$http', function ($http) {
    return {
        search: function (keywords) {
            return $http.post('/api/member/getuser', { "username": keywords });
        }
    }
}]);

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
        "PayPalEnvironmentProduction": "ATHQ3qjWVtvERFBwYCFw4S6uj9GuDfwNNW1SXRoNdCLbzFjqdpy_fHmavB6xkXqh1pVpA11pBa8J76uz",
        "PayPalEnvironmentSandbox": "Acw0Mb7Pvmfq-dN9W0EhQoiHr21ikv3hT3TBGU3Axwe_S1hfPVdCHGM47do9h8Pt7uwqvx4oNE0EfvDM"
    };

    this.init = function () {

        PayPalMobile.init(self.clientIDs, self.onPayPalMobileInit);
    }


    this.onPayPalMobileInit = function () {
        //alert(JSON.stringify(self.configuration()));
        // must be called
        // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
        //PayPalEnvironmentSandbox PayPalEnvironmentProduction
        PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", self.configuration(),
            self.onPrepareRender);
    }

    this.onAuthorizationCallback = function (authorization) {
        console.log("authorization: " + JSON.stringify(authorization, null, 4));
    }

    this.createPayment = function () {
        // for simplicity use predefined amount
        var paymentDetails = new PayPalPaymentDetails(self.paymentData['amount'], "0.00", "0.00");
        var payment = new PayPalPayment(self.paymentData['amount'], self.paymentData['currencyType'], self.paymentData['marchentName'], "Sale",
            paymentDetails);
        return payment;
    }

    this.configuration = function () {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({
            merchantName: "Rafael Camargo",
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