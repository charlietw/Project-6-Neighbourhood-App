// // Model variables
// var GoogleMarker = function(data){
//     //console.log(data.name)
//     this.name = ko.observable(data.name);
//     this.position = ko.observable(data.position);
// }

// To store the markers (global so it can be accessed by Google Maps API)
///var googleMarkers = [] *NO LONGER NEEDED ************************************


var ViewModel = function(){
    var self = this;

    // ** ADD query AS KO OBSERVABLE *******************************************
    self.query = ko.observable("");
    this.fourSquareCreds = ko.observable( {
                                        client_id : '55DJLK0E1BC5LG3WR2GHDHZWXVLQOAROEEUUAD4YQJ45PHO0',
                                        client_secret: 'X2MFOZM01IACH5DLBVOFNZBFZ1LGOVORAAXLNC20YHGKKTQR',
                                        version: 20170101,
                                    });

    // Options that the user can filter by
    this.filterOptions = ko.observableArray(["Café", "Coffee Shop", "Bank", "Pub",])

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

    // ** ADD COMPUTED OBSERVABLE TO RUN FILTER ********************************
    // http://knockoutjs.com/documentation/computedObservables.html
    this.filterList = ko.computed(function() {
      if (!self.query()) {
          self.googleMarkersFilter().forEach(function(marker) {
             marker.isVisible(true);  // updates Knockout binding
             marker.setVisible(true); // Google Maps method
          });

      } else {
          var filter = self.query().toLowerCase();
          self.googleMarkersFilter().forEach(function(marker) {

             // ** USE indexOf TO CHECK IF FILTER MATCHES **********************
             // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
             var match = marker.addresstitle.toLowerCase().indexOf(filter) !== -1;

             // USE KO visible BINDING TO SET LIST VIEW VISIBILITY *************
             // http://knockoutjs.com/documentation/visible-binding.html *******
             marker.isVisible(match);  // updates Knockout binding

             // USE GOOGLE MAPS setVisible METHOD TO SET MARKER VISIBILITY *****
             //  https://developers.google.com/maps/documentation/javascript/reference (open page and search for setVisible)
             marker.setVisible(match); // Google Maps method
          });
      }

    });


    /*
    function(clickedObject){
        setGoogleMapMarkers(null);
        var markers = googleMarkers;
        var filteredMarkers = [];
        for(var i=0; i<markers.length; i++){
            if (markers[i].category == clickedObject){
                filteredMarkers.push(markers[i]);
                // Sets the Google Map Marker to be visible
                markers[i].setMap(map);
            };
        };
        console.log(filteredMarkers);
        //return filteredMarkers;
        self.googleMarkersFilter(filteredMarkers);
    };*/

    // Clears the filter and sets the filter list
    // back to the original list.
    this.removeFilter = function(){
        setGoogleMapMarkers(map);
        self.googleMarkersFilter(self.googleMarkers)
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
                response.category = response.categories[0].shortName;
                //self.googleMarkersFilter.push(response);
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

    // self.addAllMarkers = function(clickedObject){
    //     console.log(clickedObject);
    //     markerClick(clickedObject);
    // };

    self.toggleActive = function(clickedMarker){
        // **********  ADDED GOOGLE MAPS TRIGGER METHOD ************************
        google.maps.event.trigger(clickedMarker,'click');
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