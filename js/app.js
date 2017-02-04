var ViewModel = function(){

    var self = this;

    this.fourSquareCreds = ko.observable( {
                                        client_id : '55DJLK0E1BC5LG3WR2GHDHZWXVLQOAROEEUUAD4YQJ45PHO0',
                                        client_secret: 'X2MFOZM01IACH5DLBVOFNZBFZ1LGOVORAAXLNC20YHGKKTQR',
                                        version: 20170101,
                                    });

    // To be displayed in the UI
    self.googleMarkersFilter = ko.observableArray([])

    // Input from user
    self.query = ko.observable("");

    // Filters list of responses by name
    // and selects that list to be shown by Google Maps
    this.filterList = ko.computed(function() {
        // If no user input, set all visible
        if (!self.query()) {
            self.googleMarkersFilter().forEach(function(marker) {
                marker.isVisible(true);  // updates Knockout binding
                marker.setVisible(true); // Google Maps method
          });
        }
        // Otherwise filter
        else {
            var filter = self.query().toLowerCase();
            self.googleMarkersFilter().forEach(function(marker) {
                // If match evaluates to -1 then the letter isn't present, so...
                var match = marker.addresstitle.toLowerCase().indexOf(filter) !== -1;

                // ...sets marker to either True or False
                marker.isVisible(match); // for KO
                marker.setVisible(match); // for Google Maps
            });
      }

    });

    // Removes responses without a category to prevent errors
    // and therefore improve user experience
    this.removeNullCategory = function(markers){
        var validMarkers = [];
        for(var i=0; i<markers.length; i++){
            if (markers[i].categories[0]) {
                validMarkers.push(markers[i]);
            };
        };
        return validMarkers;
    };

    // Retrieves venues from foursquare API and creates Google Map Markers
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
                response.category = response.categories[0].shortName;
                //self.googleMarkersFilter.push(response);
                // Converts to Google Map Marker
                createGoogleMapMarker(map, response);
                };
            // Error fallback
            }).error(function(){
                $('#locationHeader').text("Oops! Something went wrong with getting these markers. Open DevTools for more info.")
                console.log("Something went wrong with getting the markers from foursquare.")
        });
        };

    self.fourSquareMarkers();

    // Toggles Google Marker animation
    self.toggleActive = function(clickedMarker){
        google.maps.event.trigger(clickedMarker,'click');
    }
};


//Handling Google Maps API seprately as per the rubric.
var map, marker, geocoder;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        gestureHandling: 'greedy'
    });
    map.setCenter({lat:0, lng:0})
};

function createGoogleMapMarker(map, addressmarker){
    var marker = new google.maps.Marker({
            map: map,
            position: addressmarker.position,
            animation: google.maps.Animation.DROP,
            addresstitle: addressmarker.name,
            category: addressmarker.category,
            InfoWindow: new google.maps.InfoWindow({
                content: addressmarker.name
            })
        })
    map.setCenter(addressmarker.position);
    marker.addListener('click', markerClick);

    // ADD isVisible PROPERTY **************************************************
    marker.isVisible= ko.observable(true);

    // PUSH MARKERS TO OBSERVABLE ARRAY ****************************************
    vm.googleMarkersFilter.push(marker);
    };

    // Shows/hides Google Map Markers
    // depending on if input is null/map
function setGoogleMapMarkers(state){
    for (var i=0; i<googleMarkers.length; i++){
        googleMarkers[i].setMap(state);
    }
}

function markerClick(clickedMarker) {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
            this.InfoWindow.close();
        }
        else {
          this.setAnimation(google.maps.Animation.BOUNCE);
          this.InfoWindow.open(map, this);
        }
        console.log(this.addresstitle+" has been clicked.")
    }

//  SET vm AS GLOBAL VARIABLE **************************************************
var vm;
var init = function(){
    initMap();

    // INSTANTIATE VIEWMODEL AS GLOBAL OBJECT vm *******************************
    vm = new ViewModel();

    // APPLY BINDINGS TO GLOBAL INSTANCE OF VIEWMODEL (vm)
    ko.applyBindings(vm);
    }