/**
 * Created by Kevin on 2/7/2016.
 */

var coffeeShops = ko.observableArray();






    var viewModel = {
        coffeeShops: coffeeShops,
        query: ko.observable(''),

        search: function(value) {
            viewModel.coffeeShops.removeAll();


            console.log(coffeeShops()["name"]);
            console.log(coffeeShops["name"]);


            for(var text in coffeeShops){
                if (coffeeShops["name"][x].toLowerCase().indexOf(value.toLowerCase()) >= 0) {

                  viewModel.coffeeShops.push(coffeeShops["name"][x]);
               }
            }

        }
    };

$(document).ready(function() {
    viewModel.query.subscribe(viewModel.search);
    ko.applyBindings(viewModel);
});
