/**
 * Created by Kevin on 2/7/2016.
 */
var map;
//code taken from google maps API site
var initMap = function (){

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
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.0478963, lng: 121.516565},
        //coordinated are for taipei main station in Taiwan
        scrollwheel: true,
        // Apply the map style array to the map.
        styles: styleArray,
        zoom: 15
    });





};

function addMarker(location, label, name, review, link, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>'+
        '<div id="bodyContent"><p>' + review + '</p><p>Attribution: <a href=' + link + '/>' + link + '</a></div>'+
        '</div>';


    var marker = new google.maps.Marker({
        position: location,
        label: "" + label,
        map: map,
        animation: google.maps.Animation.DROP
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

}
// Adds a marker to the map.



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
var radius = '1000';

var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
};
parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['sort', best]);
parameters.push(['limit', amount]);
parameters.push(['radius_filter', radius]);
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
            var info ={};
            for(var i = 0; i < data.businesses.length; i++){

                addMarker({lat: data.businesses[i].location.coordinate.latitude, lng: data.businesses[i].location.coordinate.longitude},  i+1, data.businesses[i].name, data.businesses[i].snippet_text, data.businesses[i].url,map);

                info.id = i;
                info.name = data.businesses[i].name;
                info.lat = data.businesses[i].location.coordinate.longitude;
                coffeeShops.push({id: ko.observable(i), name : info.name, lat: info.lat});
               // console.log(info);
                console.log(ko.toJSON(coffeeShops));
                //console.log(viewModel.coffeeShops.info[0].name);

            }

        }


    });



var coffeeShops = ko.observableArray();
var backup =[];

$(document).ready(function(){

    var view = {
        self: this,
        data: ko.observableArray(),
       properties: coffeeShops,
        query: ko.observable(''),

        search: function(value) {

            // remove all the current beers, which removes them from the view

            console.log(ko.toJSON(view.properties));
             backup = coffeeShops.slice(0);


            console.log(ko.toJSON(backup));
            console.log(ko.toJSON(coffeeShops));
            view.properties.removeAll();

            for(var i = 0; i < backup.length; i++){
                if(backup[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    var thing = backup[i];
                    view.properties.push(thing);
                }
            }

            console.log(ko.toJSON(backup));
            coffeeShops = backup.splice(0);

        }

    };

    ko.applyBindings(view);
    view.query.subscribe(view.search);
});


