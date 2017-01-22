var markers = [
    {
        addresstitle: "32 Field Lane, Letchworth Garden City",
        contentstring: "The oooold house of me mam"
    },
    {
        addresstitle: "Fairfield Hall, Stotfold",
        contentstring: "The nnnnewwww house of me."
    },
    {
        addresstitle: "Lamex Stadium, Stevenage",
        contentstring: "BORO!!"
    },
]

var ViewModel = function(){

    var self = this;

    this.markerList = ko.observableArray([])

    markers.forEach(function(marker){
        self.markerList.push(marker);
    });

    self.activeMarker = ko.observable(this.markerList()[0]);

    self.toggleActive = function(clickedMarker){
        self.activeMarker(clickedMarker)
        console.log(self.activeMarker());
    }

    // this.addMarker = function(marker){
    //     self.markerList.push(marker);
    //     console.log(self.markerList)
    // };

};



// console.log(ViewModel().addMarker())

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
var map, marker, geocoder;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10
    });
    geocoder = new google.maps.Geocoder();
    //Takes the array of addresses and makes them markers that Google Maps can read
    markers.forEach(function(marker){
        createGoogleMapMarker(geocoder, map, marker)
    })
};

function createGoogleMapMarker(geocoder, map, addressmarker){
    geocoder.geocode( { 'address': addressmarker.addresstitle}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
            addresstitle: addressmarker.addresstitle,
            InfoWindow: new google.maps.InfoWindow({
                content: addressmarker.contentstring
            })
        });
        marker.addListener('click', markerClick)
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

function markerClick() {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
        }
        else {
          this.setAnimation(google.maps.Animation.BOUNCE);
        }
        this.InfoWindow.open(map, this)
        console.log(this.addresstitle+" has been clicked.")
    }


// var geocoder = new google.maps.Geocoder();
// var mapreturn = geocoder.geocode({"address":"32 Field Lane, Letchworth Garden City"})
// console.log(mapreturn)