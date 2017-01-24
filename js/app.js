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

    this.fourSquareCreds = ko.observable( {
                                        client_id : '55DJLK0E1BC5LG3WR2GHDHZWXVLQOAROEEUUAD4YQJ45PHO0',
                                        client_secret: 'X2MFOZM01IACH5DLBVOFNZBFZ1LGOVORAAXLNC20YHGKKTQR',
                                        version: 20170101,
                                    });

    // Options that the user can filter by
    this.filterOptions = ko.observableArray(["Café", "Coffee Shop", "Bank", "Pub",])

    // Think this is obsolete?
    this.currentFilter = ko.observable(this.filterOptions()[0])

    // To store the full list
    self.googleMarkers = ko.observableArray([]);

    // To be displayed in the UI
    self.googleMarkersFilter = ko.observableArray([])

    // Removes responses without a category to prevent errors
    // and therefore improve user experience
    this.removeNullCategory = function(markers){
        var validMarkers = [];
        for(var i=0; i<markers.length; i++){
            if (markers[i].categories[0]) {
                validMarkers.push(markers[i]);
                //console.log(markers[i].categories[0].shortName);
            };
        };
        return validMarkers;
    };

    // Filters list of responses by name
    // and selects that list to be shown by Google Maps
    this.filterList = function(clickedObject){
        setGoogleMapMarkers(null);
        var markers = self.googleMarkers();
        var filteredMarkers = [];
        for(var i=0; i<markers.length; i++){
            if (markers[i].categories[0].shortName == clickedObject){
                filteredMarkers.push(markers[i]);
                // Sets the Google Map Marker to be visible
                // As both arrays were created at same time,
                // using [i] will work.
                googleAPIMarkers[i].setMap(map);
            };
        };
        self.googleMarkersFilter(filteredMarkers);
    };

    // Clears the filter and sets the filter list
    // back to the original list.
    this.removeFilter = function(){
        setGoogleMapMarkers(map);
        self.googleMarkersFilter(self.googleMarkers())
    }

    // Retrieves venues from foursquare API and creates Google Map
    // Markers, optionally filtering the results
    this.fourSquareMarkers = function(filter){
        url = "https://api.foursquare.com/v2/venues/search?client_id="+
                self.fourSquareCreds().client_id+"&client_secret="+
                self.fourSquareCreds().client_secret+"&near=Letchworth,UK&v="+
                self.fourSquareCreds().version+"20170101&m=foursquare"
        $.getJSON(url, function(data) {
            var venues = self.removeNullCategory(data.response.venues)
            for(var i=0; i<venues.length; i++){
                var response = venues[i];
                // Adds 'position' attribute for Google Maps API
                response.position = {
                                lat: response.location.lat,
                                lng: response.location.lng
                            };
                self.googleMarkers.push(response);
                self.googleMarkersFilter.push(response);
                // Converts to Google Map Marker
                createGoogleMapMarker(map, response);
                };
            // Error handling
            }).error(function(){
                $('#locationHeader').text("Oops! Something went wrong with getting these markers. Open DevTools for more info.")
                console.log("Something went wrong with getting the markers from foursquare.")
        });
        };

    self.fourSquareMarkers();



    self.googleMarkers().forEach(function(marker){
            createGoogleMapMarker(map, marker);
        });


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
        zoom: 15
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

    // Shows/hides Google Map Markers
    // depending on if input is null/map
function setGoogleMapMarkers(state){
    for (var i=0; i<googleAPIMarkers.length; i++){
        googleAPIMarkers[i].setMap(state);
    }
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