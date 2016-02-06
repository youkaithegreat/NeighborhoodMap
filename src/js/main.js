/**
 * Created by Kevin on 2/7/2016.
 */

//code taken from google maps API site
function initMap() {

    //Green!
    var styleArray = [
        {
            featureType: "all",
            "stylers": [
                { "saturation": 0 },
                { "lightness": 0 },
                { "hue": "#00ff11" },
                { "gamma": 0.68 }
            ]
        },{
            featureType: "poi.business",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.0478963, lng: 121.516565},
        //coordinated are for taipei main station in Taiwan
        scrollwheel: true,
        // Apply the map style array to the map.
        styles: styleArray,
        zoom: 15
    });
}
/* code provided from
https://github.com/levbrie/mighty_marks/blob/master/yelp-search-sample.html

*/
var auth = {
    //
    // Update with your auth tokens.
    //
    consumerKey : "IGfiXK01QiIcfiqaKDVR2A",
    consumerSecret : "57UqsYA2wVdVm6XRLMBo7GIcSKM",
    accessToken : "azapevIdp58SLt9wTU1NJ1JOD6Ybluiy",
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    accessTokenSecret : "IDZpMqnkXIDx2WtZTPewksFTZW0",
    serviceProvider : {
        signatureMethod : "HMAC-SHA1"
    }
};
var terms = 'coffee';
var near = 'Taipei Main Station';
var best = '2';
var amount = '10';

var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
};
parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['sort', best]);
parameters.push(['limit', amount]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
var message = {
    'action' : 'http://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);
var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
console.log(parameterMap);

$.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'cache' : true,
    'dataType' : 'jsonp',
    'jsonpCallback' : 'cb',
    'success' : function(data) {
        console.log(data);
        console.log(message.action);
    }
});
