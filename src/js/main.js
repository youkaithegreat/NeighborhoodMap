/**
 * Created by Kevin on 2/7/2016.
 * This is the code for a site that shows a map centered around Taipei Main Station and queries the 10 closest coffee shops and returns it on screen.
 */
//global variable, so that it can be accessed by other functions.
var map;

//code taken from google maps API site
//initializes map on start.
var initMap = function() {

    //Preset style taken from https://snazzymaps.com/style/2/midnight-commander
    var styleArray = [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 13
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#144b53"
        }, {
            "lightness": 14
        }, {
            "weight": 1.4
        }]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#08304b"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#0c4152"
        }, {
            "lightness": 5
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#0b434f"
        }, {
            "lightness": 25
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#0b3d51"
        }, {
            "lightness": 16
        }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }]
    }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "color": "#146474"
        }]
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#021019"
        }]
    }];

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        //centered around Taipei Main Station
        center: {
            lat: 25.0478963,
            lng: 121.516565
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        //coordinated are for taipei main station in Taiwan
        scrollwheel: true,
        // Apply the map style array to the map.
        styles: styleArray,
        zoom: 15
    });


};

var googleError = function(){
  alert("There was a problem with Google and we can't load the map!");
};

//global variables, to allow window closure
var infowindow;
var markerList = [];
var coffeeShops = ko.observableArray();
var backup = [];

function addMarker(location, name, review, link, id, map) {
    // Adds a marker with the information received from AJAX and Yelp API

    var contentString = '<div id="content"><div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
        '<div id="bodyContent"><p>' + review + '</p><p><a href=' + link + '/> Click for more info on Yelp! </a></div>' +
        '</div>';

    //initially places marker
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'img/coffee.png',
        animation: google.maps.Animation.DROP,
        content: contentString
    });

    //this adds the click functionality, animation, info window
    marker.addListener('click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 3000);
    });

    infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    markerList.push(marker);


}


/* code adapted from
 https://github.com/levbrie/mighty_marks/blob/master/yelp-search-sample.html
 */

//tried to encapsulate the authorization and ajax request into one.
//first half is all OAuth, second half is ajax request. Authetnicate gets run at the bottom
var Authenticate = function() {

    var self = this;
    self.terms = 'coffee';
    self.near = 'Taipei Main Station';
    self.best = '2';
    self.amount = '10';
    self.radius = '1000';

    var auth = {
        // Authentication tokens

        consumerKey: "IGfiXK01QiIcfiqaKDVR2A",
        consumerSecret: "57UqsYA2wVdVm6XRLMBo7GIcSKM",
        accessToken: "azapevIdp58SLt9wTU1NJ1JOD6Ybluiy",
        accessTokenSecret: "IDZpMqnkXIDx2WtZTPewksFTZW0",
        serviceProvider: {
            signatureMethod: "HMAC-SHA1"
        }
    };

    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };

    self.parameters = [];
    parameters.push(['term', self.terms]);
    parameters.push(['location', self.near]);
    parameters.push(['sort', self.best]);
    parameters.push(['limit', self.amount]);
    parameters.push(['radius_filter', self.radius]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    self.message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };

    OAuth.setTimestampAndNonce(self.message);
    OAuth.SignatureMethod.sign(self.message, accessor);
    self.parameterMap = OAuth.getParameterMap(self.message.parameters);
    self.parameterMap.oauth_signature = OAuth.percentEncode(self.parameterMap.oauth_signature);
    console.log(self.parameterMap);

    //ajax request from YELP API, uses JSONP. Error checking is from setTimeout()
    $.ajax({
        'url': self.message.action,
        'data': self.parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
        'success': function(data) {
            console.log(data);
            var info = {};

            //runs through and parses data to display on the website.
            for (var i = 0; i < data.businesses.length; i++) {

                this.location = {
                    lat: data.businesses[i].location.coordinate.latitude,
                    lng: data.businesses[i].location.coordinate.longitude
                };
                this.name = data.businesses[i].name;

                //if snippet_text can not be found, returns no info found
                if (data.businesses[i].snippet_text === undefined) {
                    this.snippet_text = "No info found!";
                } else {
                    this.snippet_text = data.businesses[i].snippet_text;
                }

                this.url = data.businesses[i].url;

                //adds marker on the screen
                addMarker(this.location, this.name, this.snippet_text, this.url, i, map);

                //makes observable/updating array using knockout.
                coffeeShops.push({
                    id: ko.observable(i),
                    name: this.name,
                    snippet: this.snippet_text
                });

                //Error checking troubleshooting. Shows what returns in the array through console.
                console.log(ko.toJSON(coffeeShops));

                //on completion it clears the timeout.
                clearTimeout(yelpRequestTimeout);
            }


        }
    });

    //simple setTimeout to check if the request comes back properly or not from YELP API
    var yelpRequestTimeout = setTimeout(function() {
        $('#listTitle').text("Failed to get Yelp Info! Sorry! :(");
    }, 5000);
};




//viewModel that updates the screen markers as well as list view.
$(document).ready(function() {

    var viewModel = {
        self: this,
        data: ko.observableArray(),
        properties: coffeeShops,
        query: ko.observable(''),
        //SUPER IMPORTANT **, must store things in back up TWICE. once at the beginning and at the end. TO KEEP THE ARRAY FROM DESTRUCTING\
        //live search implementation from list view.
        search: function(value) {

            //used to check where my array was going!
            console.log(ko.toJSON(viewModel.properties));

            //makes a backup copy of info stored from AJAX request
            backup = coffeeShops.slice(0);

            //some more error checking. Make sure both of the arrays still exist.
            console.log(ko.toJSON(backup));
            console.log(ko.toJSON(coffeeShops));

            //super destructive removeAll. Completely clears memory of any array linked to that information.
            //You need th beackup, because of this.
            viewModel.properties.removeAll();

            //simple live search implementation
            //clears markers as well as list
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

        },
        openWindows: function(data, event) {

            id = event.currentTarget.id;
            console.log(id);
            infowindow.setContent(markerList[id].content);
            infowindow.open(map, markerList[id]);
            markerList[id].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                markerList[id].setAnimation(null);
            }, 3000);
        }

    };

    ko.applyBindings(viewModel);
    viewModel.query.subscribe(viewModel.search);
});

//runs and retrieves the info from YELP api
Authenticate();