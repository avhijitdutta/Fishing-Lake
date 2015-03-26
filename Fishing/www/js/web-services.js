/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.factory("webservice", function () {
    var e = {};
    var t = "http://ncrts.com/fishing_lake/webservice/";
    e.getService = function (e) {
        return t + e
    };
    e.getServiceBase = function () {
        return t
    };
    return e
});
