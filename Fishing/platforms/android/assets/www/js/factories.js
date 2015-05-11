/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.factory("localFactory", ['$http', 'webservice' , function ($http, webservice) {
    var localFactory = {};
    localFactory.lang = {
        alert: 'Alert',
        ok: 'OK',
        cancel: 'Cancel',
        confirm: 'Confirm',
        write_something: 'Write something',
        action: 'Action',
        exit: 'Exit',
        no_internet: "Please check your internet connection",
        loading: "Loading..."
    }

    localFactory.loadOptions = {
        customSpinner: false,
        position: "middle",
        label: localFactory.lang.loading,
        bgColor: "#000",
        opacity: 0.5,
        color: "#fff"

    };

    localFactory.isMobile = true;

    localFactory.flushables = [];


    localFactory.post = function (slug, dataPost) {
        localFactory.checkInternet();
        var http = $http({
            method: "POST",
            url: webservice.getService(slug),
            data: $.param(dataPost),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        http.error(function (data, status, headers, config) {
            localFactory.unload();
            console.debug("Error Status : ", status);
            console.debug("Error Headers : ", headers);
            console.debug("Error Data : ", data);
            console.debug("Error Config : ", config);
        });
        return http;
    };
    localFactory.get = function (slug, dataGet) {
        localFactory.checkInternet();
        var http = $http({
            method: "GET",
            url: webservice.getService(slug),
            data: $.param(dataGet)
        });

        http.error(function (data, status, headers, config) {
            localFactory.unload();
            console.debug("Error Status : ", status);
        });
        return http;
    };
    localFactory.getJson = function (url) {
        return $http.get(url);
    };
    localFactory.load = function () {
        try {
            wizSpinner.show(localFactory.loadOptions);
        } catch (error) {
            console.log('Error', error.message);
        }
    };
    localFactory.unload = function () {
        try {
            wizSpinner.hide();
        } catch (error) {
            console.log('Error', error.message);
        }
    };
    localFactory.setLocalItem = function (key, value) {
        window.localStorage.setItem(key, value);
    };
    localFactory.getLocalItem = function (key) {
        return window.localStorage.getItem(key);
    };
    localFactory.flushLocalItem = function (key) {
        window.localStorage.removeItem(key);
    };
    localFactory.flushLocalItems = function () {
        for (fa in localFactory.flushables) {
            if (localFactory.flushables[fa]) {
                localFactory.flushLocalItem(fa);
                delete localFactory.flushables[fa];
            }
        }
    };
    localFactory.alert = function (message, callback, title, buttonName) {

        title = title || localFactory.lang.alert;
        buttonName = buttonName || localFactory.lang.ok;

        if (navigator.notification && navigator.notification.alert) {

            navigator.notification.alert(
                message,    // message
                callback,   // callback
                title,      // title
                buttonName  // buttonName
            );

        } else {
            alert(message);
            if (typeof callback !== "undefined") {
                callback();
            }
        }

    };
    localFactory.confirm = function (message, callback, buttonLabels, title) {

        //Set default values if not specified by the user.
        buttonLabels = buttonLabels || [localFactory.lang.ok, localFactory.lang.cancel];

        title = title || localFactory.lang.confirm;

        //Use Cordova version of the confirm box if possible.
        if (navigator.notification && navigator.notification.confirm) {

            var _callback = function (index) {
                if (callback) {
                    callback(index);
                }
            };

            navigator.notification.confirm(
                message,      // message
                _callback,    // callback
                title,        // title
                buttonLabels  // buttonName
            );

            //Default to the usual JS confirm method.
        } else {
            var a = confirm(message);
            if (a) {
                callback(1);
            } else {
                return false;
            }

        }
    };
    localFactory.prompt = function (message, callback, dftext, title, buttonLabels) {

        //Set default values if not specified by the user.
        buttonLabels = buttonLabels || [localFactory.lang.ok, localFactory.lang.cancel];

        title = title || localFactory.lang.action;
        dftext = dftext || localFactory.lang.write_something;

        //Use Cordova version of the confirm box if possible.
        if (navigator.notification && navigator.notification.confirm) {

            var _callback = function (answer) {
                if (answer.buttonIndex === 1) {
                    if (callback) {
                        callback(answer.input1);
                    }
                    // Ok
//                    var newcat = answer.input1;
                }
                else {
                    return false;
                }
            };
            window.navigator.notification.prompt(
                message, // message
                _callback, // callback
                title, //title
                [localFactory.lang.ok, localFactory.lang.exit], // button titles
                dftext// defaultText
            );

            //Default to the usual JS confirm method.
        } else {
            var a = prompt(message, dftext);
            if (a) {
                callback(a);
            } else {
                return false;
            }
            //invoke(callback, confirm(message));
        }
    };
    localFactory.toast = function (message, duration, position) {
        position = position || 'bottom';
        duration = duration || 'short';
        try {
            window.plugins.toast.show(message, duration, position);
        } catch (e) {
            alert(message);
            console.log(e.message);
        }
    };
    localFactory.checkInternet = function () {
        try {
            if (navigator.connection) {
                var networkState = navigator.connection.type;
                if (networkState === Connection.NONE) {
                    localFactory.alert(localFactory.lang.no_internet);
                    return false;
                }
            }
        } catch (e) {
            console.log(e.message);
        }
        return true;
    };

    localFactory.arrMonth = ["JAN", "FEV", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    localFactory.arrDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    return localFactory;
}]);

