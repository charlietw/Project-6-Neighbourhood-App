var initialCats = [
    {
        name:"Frank",
        imgSrc: "https://files.graphiq.com/stories/t2/tiny_cat_12573_8950.jpg",
        clickCount: 0,
        nickname:["Nickname","Another one","Ain't he cute"]
    },

    {
        name:"Boris",
        imgSrc: "https://www.petdrugsonline.co.uk/images/page-headers/cats-master-header",
        clickCount: 0,
        nickname:["Nickname","Another one","Ain't he cute"]
    },

    {
        name:"Badger",
        imgSrc: "https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg",
        clickCount: 0,
        nickname:["Nickname","Another one","Ain't he cute"]
    },

    {
        name:"Belinda",
        imgSrc: "https://s-media-cache-ak0.pinimg.com/736x/07/c3/45/07c345d0eca11d0bc97c894751ba1b46.jpg",
        clickCount: 0,
        nickname:["Nickname","Another one","Ain't he cute"]
    }]

var Cat = function(data){
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.clickCount = ko.observable(data.clickCount);
    this.nickname = ko.observableArray(data.nickname)

    this.levels = ko.observableArray([
        {clicks:20, levelName: "Teen"},
        {clicks:10, levelName: "Junior"},
        {clicks:0, levelName: "Infant"},
        ]);

    this.level = ko.computed(function(){
        var click = this.clickCount();
        var currentLevel = ko.observable(0)
        for(var i=0; i < this.levels().length; i++){
            if (click >= this.levels()[i].clicks){
                return this.levels()[i].levelName
            }
        }
    }, this);


    }

var ViewModel = function(){

    var self = this;
    this.catList = ko.observableArray([])

    initialCats.forEach(function(catItem){
        self.catList.push( new Cat(catItem));
    });

    this.currentCat = ko.observable(this.catList()[0]);
    this.incrementCount = function(){
        this.clickCount(this.clickCount()+1);
    };

    this.setCurrentCat = function(clickedCat){
        self.currentCat(clickedCat)
    }
}




ko.applyBindings(new ViewModel());