// Model variables
var GoogleMarker = function(data){
    //console.log(data.name)
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
}

//var markers = ko.observableArray([]);

//var googleMarkers = ko.observableArray([]);

var cuisineOptions = ["Indian", "Chinese", "Pizza"]

var fourSquareCreds = ko.observable( {
    client_id : '55DJLK0E1BC5LG3WR2GHDHZWXVLQOAROEEUUAD4YQJ45PHO0',
    client_secret: 'X2MFOZM01IACH5DLBVOFNZBFZ1LGOVORAAXLNC20YHGKKTQR',
    version: 20170101,
    query: "chinese"
});
//Current problem - this isn't refreshing!!
var foursquareurl = ko.observable( "https://api.foursquare.com/v2/venues/search?client_id="+
                    fourSquareCreds().client_id+"&client_secret="+
                    fourSquareCreds().client_secret+"&near=Letchworth,UK&query="+fourSquareCreds().query+"&v="+
                    fourSquareCreds().version+"20170101&m=foursquare");


var ViewModel = function(){
    var self = this;

    self.googleMarkers = ko.observableArray([]);

    //Used to be a function - still could be? Retrieves markers for Chinese restaurants near Letchworth.
    //this.fourSquareMarkers = function(){
        $.getJSON(foursquareurl(), function(data) {
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
        //};
    //self.fourSquareMarkers()


    self.googleMarkers().forEach(function(marker){
            createGoogleMapMarker(map, marker);
        });

    self.testFunc = function(clickedObject){
        fourSquareCreds.query = clickedObject
        console.log(fourSquareCreds.query)
        clearGoogleMapMarkers()
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


// var Cat = function(data){
//     this.name = ko.observable(data.name);
//     this.imgSrc = ko.observable(data.imgSrc);
//     this.clickCount = ko.observable(data.clickCount);
//     this.nickname = ko.observableArray(data.nickname)

//     this.levels = ko.observableArray([
//         {clicks:20, levelName: "Teen"},
//         {clicks:10, levelName: "Junior"},
//         {clicks:0, levelName: "Infant"},
//         ]);

//     this.level = ko.computed(function(){
//         var click = this.clickCount();
//         var currentLevel = ko.observable(0)
//         for(var i=0; i < this.levels().length; i++){
//             if (click >= this.levels()[i].clicks){
//                 return this.levels()[i].levelName
//             }
//         }
//     }, this);


//     }

// var ViewModel = function(){

//     var self = this;
//     this.catList = ko.observableArray([])

//     initialCats.forEach(function(catItem){
//         self.catList.push( new Cat(catItem));
//     });

//     this.currentCat = ko.observable(this.catList()[0]);
//     this.incrementCount = function(){
//         this.clickCount(this.clickCount()+1);
//     };

//     this.setCurrentCat = function(clickedCat){
//         self.currentCat(clickedCat)
//     }
// }






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

// function createGoogleMapMarker(map, addressmarker){
//     var marker = new google.maps.Marker({
//             map: map,
//             position: addressmarker.position(),
//             animation: google.maps.Animation.DROP,
//             addresstitle: addressmarker.name(),
//             InfoWindow: new google.maps.InfoWindow({
//                 content: addressmarker.name()
//             })
//         })
//     map.setCenter(addressmarker.position());
//     marker.addListener('click', markerClick);
//     };

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