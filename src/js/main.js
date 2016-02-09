/**
 * Created by Kevin on 2/7/2016.
 */
var map;
//code taken from google maps API site
var initMap = function () {

    //Green!
    var styleArray = [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#ffffff"}]
    }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#000000"}, {"lightness": 13}]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#000000"}]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#144b53"}, {"lightness": 14}, {"weight": 1.4}]
    }, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#08304b"}]}, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{"color": "#0c4152"}, {"lightness": 5}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#000000"}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#0b434f"}, {"lightness": 25}]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#000000"}]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#0b3d51"}, {"lightness": 16}]
    }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}]
    }, {"featureType": "transit", "elementType": "all", "stylers": [{"color": "#146474"}]}, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"color": "#021019"}]
    }];

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

//global variable, to allow window closure for

var infowindow;
var markerList = [];

function addMarker(location, name, review, link, id, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.


    var contentString = '<div id="content"><div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
        '<div id="bodyContent"><p>' + review + '</p><p><a href=' + link + '/> Click for more info on Yelp! </a></div>' +
        '</div>';


    var marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP,
        content: contentString
    });

    marker.addListener('click', function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });

    infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    markerList.push(marker);
}
// Adds a marker to the map.

function openWindows(id) {
    infowindow.setContent(markerList[id].content);
    infowindow.open(map, markerList[id]);
}


/* code provided from
 https://github.com/levbrie/mighty_marks/blob/master/yelp-search-sample.html

 */
var auth = {
    //
    // Update with your auth tokens.
    //
    consumerKey: "IGfiXK01QiIcfiqaKDVR2A",
    consumerSecret: "57UqsYA2wVdVm6XRLMBo7GIcSKM",
    accessToken: "azapevIdp58SLt9wTU1NJ1JOD6Ybluiy",
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    accessTokenSecret: "IDZpMqnkXIDx2WtZTPewksFTZW0",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1"
    }
};
var terms = 'coffee';
var near = 'Taipei Main Station';
var best = '2';
var amount = '10';
var radius = '1000';

var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
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
    'action':'http://api.yelp.com/v2/search',
    //correct 'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);
var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
console.log(parameterMap);


var yelpRequestTimeout = setTimeout(function(){
    $('#listTitle').text("Failed to get Yelp Info! Sorry! :(");
}, 8000);

var getYelp = $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function (data) {
        console.log(data);
        var info = {};
        for (var i = 0; i < data.businesses.length; i++) {

            this.location = {
                lat: data.businesses[i].location.coordinate.latitude,
                lng: data.businesses[i].location.coordinate.longitude
            };
            this.name = data.businesses[i].name;

            if (data.businesses[i].snippet_text == undefined) {
                this.snippet_text = "No info found!";
            } else {
                this.snippet_text = data.businesses[i].snippet_text;
            }

            this.url = data.businesses[i].url;

            addMarker(this.location, this.name, this.snippet_text, this.url, i, map);


            coffeeShops.push({id: ko.observable(i), name: this.name, snippet: this.snippet_text});
            // console.log(info);
            console.log(ko.toJSON(coffeeShops));
            //console.log(viewModel.coffeeShops.info[0].name);
            clearTimeout(yelpRequestTimeout);
        }


    }
});


var coffeeShops = ko.observableArray();
var backup = [];

$(document).ready(function () {

    var viewModel = {
        self: this,
        data: ko.observableArray(),
        properties: coffeeShops,
        query: ko.observable(''),


        //SUPER IMPORTANT **, must store things in back up TWICE. once at the beginning and at the end. TO KEEP THE ARRAY FROM DESTRUCTING
        search: function (value) {

            // remove all the current beers, which removes them from the view

            console.log(ko.toJSON(viewModel.properties));
            backup = coffeeShops.slice(0);


            console.log(ko.toJSON(backup));
            console.log(ko.toJSON(coffeeShops));
            viewModel.properties.removeAll();

            for (var i = 0; i < backup.length; i++) {
                if (backup[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    var thing = backup[i];

                    viewModel.properties.push(thing);
                    markerList[i].setVisible(true);
                } else {
                    markerList[i].setVisible(false);
                }
            }

            console.log(ko.toJSON(backup));
            coffeeShops = backup.splice(0);

        }

    };

    ko.applyBindings(viewModel);
    viewModel.query.subscribe(viewModel.search);
});


