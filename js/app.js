/** Raising errors with API calls referencing a line number
 * @example
 * // Informs the user that an error has ocurred with Google on line 4
 * raiseError("Google",4);
*/
function raiseError(errorOrigin, line){
    $("#locationHeader").text("Oops! Something went wrong with " + errorOrigin + ". Open DevTools for more info.");
    $("#showhide").text("Error - click me!");
    console.log("Something went wrong with " + errorOrigin + ". Line "+ line);
}

var ViewModel = function(){

    var self = this;

    self.fourSquareCreds = ko.observable( {
                                        client_id : '55DJLK0E1BC5LG3WR2GHDHZWXVLQOAROEEUUAD4YQJ45PHO0',
                                        client_secret: 'X2MFOZM01IACH5DLBVOFNZBFZ1LGOVORAAXLNC20YHGKKTQR',
                                        version: 20170101,
                                    });

    // To be displayed in the UI
    self.googleMarkersFilter = ko.observableArray([]);

    // Input from user
    self.query = ko.observable("");

    // Filters list of responses by name
    // and selects that list to be shown by Google Maps
    self.filterList = ko.computed(function() {
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

    /** Removes responses without a category to prevent errors
    // and therefore improve user experience */
    self.removeNullCategory = function(markers){
        var validMarkers = [];
        markers.forEach(function(marker){
            if (marker.categories[0]) {
                validMarkers.push(marker);
            }
        });
        return validMarkers;
    };

    /** Retrieves venues from foursquare API and creates Google Map Markers*/
    self.fourSquareMarkers = function(filter){
        var url = "https://api.foursquare.com/v2/venues/search?client_id="+
                self.fourSquareCreds().client_id+"&client_secret="+
                self.fourSquareCreds().client_secret+"&near=Letchworth,UK&v="+
                self.fourSquareCreds().version+"20170101&m=foursquare";
        $.getJSON(url, function(data) {
            var venues = self.removeNullCategory(data.response.venues);
            venues.forEach(function(venue){
                var response = venue;
                // Adds 'position' attribute for Google Maps API
                response.position = {
                                lat: response.location.lat,
                                lng: response.location.lng
                            };
                response.category = response.categories[0].shortName;
                response.checkins = response.stats.checkinsCount;
                // Converts to Google Map Marker
                createGoogleMapMarker(map, response);
                });
            // Error fallback
            }).error(function(){
                raiseError("Foursquare", 82)
        });
        };

    self.fourSquareMarkers();

    /** Toggles Google Marker animation */
    self.toggleActive = function(clickedMarker){
        google.maps.event.trigger(clickedMarker,'click');
    };
};


/**Handling Google Maps API seprately as per the rubric. */
var map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        gestureHandling: 'greedy'
    });
    map.setCenter({lat:0, lng:0});
    };

function googleError(){
    $("#showhide").text("Error - click me!");
}

function createGoogleMapMarker(map, addressmarker){
    var marker = new google.maps.Marker({
            map: map,
            position: addressmarker.position,
            animation: google.maps.Animation.DROP,
            addresstitle: addressmarker.name,
            category: addressmarker.category,
            InfoWindow: new google.maps.InfoWindow({
                content: "<h5>"+addressmarker.name+"</h5><br>Category: "+
                        addressmarker.category+"<br>Total check-ins: "+
                        addressmarker.checkins
            })
        });
    map.setCenter(addressmarker.position);
    marker.addListener('click', markerClick);

    // Creates a knockout observable which sets visibility
    marker.isVisible= ko.observable(true);

    // Pushes to array in ViewModel
    vm.googleMarkersFilter.push(marker);
    };

/** For when a marker is clicked */
function markerClick(clickedMarker) {
    vm.googleMarkersFilter().forEach(function(marker){
        marker.setAnimation(null);
        marker.InfoWindow.close();
    });
    if (this.getAnimation() !== null) {
        this.setAnimation(null);
        this.InfoWindow.close();
    }
    else {
      this.setAnimation(google.maps.Animation.BOUNCE);
      this.InfoWindow.open(map, this);
    }
}

var vm;
var init = function(){
    initMap();

    vm = new ViewModel();

    ko.applyBindings(vm);
    };