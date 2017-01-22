var ViewModel = function(){
    this.googleMapsAPIKey = ko.observable("AIzaSyAjy3D1w466JIWeKUi8nZcT1oH6dBPLt4c");
    this.googleMapsURL = ko.observable("https://maps.googleapis.com/maps/api/js?key="+this.googleMapsAPIKey()+"&callback=initMap");
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




ko.applyBindings(new ViewModel());

//Handling Google Maps API seprately as per the rubric.
var map, uluru, marker, geocoder;
function initMap() {
    uluru = {lat: -34.397, lng: 150.644}
    map = new google.maps.Map(document.getElementById('map'), {
        center: uluru,
        zoom: 8
    });
    // marker = new google.maps.Marker({
    //     position: uluru,
    //     map: map
    // });
    geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', function() {
            geocodeAddress(geocoder, map);
        });
};

function geocodeAddress(geocoder, map){
    var address = document.getElementById('location').value;
    console.log(geocoder);
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

// var geocoder = new google.maps.Geocoder();
// var mapreturn = geocoder.geocode({"address":"32 Field Lane, Letchworth Garden City"})
// console.log(mapreturn)