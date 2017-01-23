// Model variables
var GoogleMarker = function(data){
    //console.log(data.name)
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
}

//var markers = ko.observableArray([]);

//var googleMarkers = ko.observableArray([]);


var ViewModel = function(){
    var self = this;
    this.cuisineOptions = ko.observableArray(["Indian", "Chinese", "Pizza"])
    this.fourSquareCreds = ko.observable( {
                                            client_id : '55DJLK0E1BC5LG3WR2GHDHZWXVLQOAROEEUUAD4YQJ45PHO0',
                                            client_secret: 'X2MFOZM01IACH5DLBVOFNZBFZ1LGOVORAAXLNC20YHGKKTQR',
                                            version: 20170101,
                                            query: "chinese"
                                        });

    this.initalCuisine = this.cuisineOptions()[0]

    this.foursquareurl = ko.computed(function(){
                            return "https://api.foursquare.com/v2/venues/search?client_id="+
                            self.fourSquareCreds().client_id+"&client_secret="+
                            self.fourSquareCreds().client_secret+"&near=Letchworth,UK&query="+self.fourSquareCreds().query+"&v="+
                            self.fourSquareCreds().version+"20170101&m=foursquare"
                        });
    console.log(self.foursquareurl())
    self.googleMarkers = ko.observableArray([]);

    //Used to be a function - still could be? Retrieves markers for Chinese restaurants near Letchworth.
    this.fourSquareMarkers = function(cuisine){
        url = "https://api.foursquare.com/v2/venues/search?client_id="+
                self.fourSquareCreds().client_id+"&client_secret="+
                self.fourSquareCreds().client_secret+"&near=Letchworth,UK&query="+cuisine+"&v="+
                self.fourSquareCreds().version+"20170101&m=foursquare"
        $.getJSON(url, function(data) {
            $.each(data.response.venues, function(){
                // Adds an attribute for Google Maps to place the position.
                this.position = {
                                lat: this.location.lat,
                                lng: this.location.lng
                            };
                self.googleMarkers.push(this);
                createGoogleMapMarker(map, this);
                });
            }).error(function(){
                $('#locationHeader').text("Oops! Something went wrong with getting these markers. Open DevTools for more info.")
                console.log("Something went wrong with getting the markers from foursquare.")
        });
        };
    self.fourSquareMarkers(self.initalCuisine);


    self.googleMarkers().forEach(function(marker){
            createGoogleMapMarker(map, marker);
        });

    self.testFunc = function(clickedObject){
        self.fourSquareCreds().query = clickedObject;
        // console.log(self.fourSquareCreds().query);
        // console.log(self.foursquareurl());
        clearGoogleMapMarkers();
        self.googleMarkers([]);
        self.fourSquareMarkers(clickedObject);
    }

    self.addAllMarkers = function(clickedObject){
        console.log("In development.")
        // self.googleMarkers().forEach(function(marker){
        //     marker.setMap(null);
        //     // self.markerList.push(marker);
        // });
    };

    self.activeMarker = ko.observable(this.googleMarkers()[0]);

    self.toggleActive = function(clickedMarker){
        markerClick(clickedMarker)
        self.activeMarker(clickedMarker)
    }
};


//Handling Google Maps API seprately as per the rubric.
var map, marker, geocoder;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10
    });
    map.setCenter({lat:0, lng:0})
};

var googleAPIMarkers = []

function createGoogleMapMarker(map, addressmarker){
    var marker = new google.maps.Marker({
            map: map,
            position: addressmarker.position,
            animation: google.maps.Animation.DROP,
            addresstitle: addressmarker.name,
            InfoWindow: new google.maps.InfoWindow({
                content: addressmarker.name
            })
        })
    map.setCenter(addressmarker.position);
    marker.addListener('click', markerClick);
    googleAPIMarkers.push(marker);
    };

function clearGoogleMapMarkers(){
    for (var i=0; i<googleAPIMarkers.length; i++){
        googleAPIMarkers[i].setMap(null);
    }
    googleAPIMarkers = []
}

function markerClick(clickedMarker) {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
        }
        else {
          this.setAnimation(google.maps.Animation.BOUNCE);
        }
        this.InfoWindow.open(map, this)
        console.log(this.addresstitle+" has been clicked.")
    }

var init = function(){
    initMap();
    ko.applyBindings(new ViewModel());
    }