var app = angular.module('umbrellaApp', ['ui.bootstrap']);

app.controller('mainCtrl', function ($scope, $http, $location, $anchorScroll) {

    $scope.forecasts = [];
    $scope.locations = [];

    /* Sundsvall is set to default location
    TODO: Add cookie to store last used location and load it.
     */

    $scope.selectedLocation = {
        name: "Sundsvall",
        id: "2670781"
    };

    //Function for scrolling within the single-page app
    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    };


    /*Function that reads the location data for all searchable sites, only Sweden is supported
    TODO: Add function to select other countries apart from Sweden.
     */
    $scope.readJSON = function () {
        $http.get('data/se.city.json').success(function (data) {
            $scope.locations = data;
        });
    };


    /*
    Function that makes a call to openweathermaps API to get 5-day forecasts,
    selectedLocation.id is a predefined id for the API to recognise the location.
    */
    $scope.getWeather = function () {
        $http({
            method: 'GET',
            url: 'https://api.openweathermap.org/data/2.5/forecast?id='
            + $scope.selectedLocation.id
            + '&appid=2a7830a80daa8519a19f0ab69cca58b5&units=metric'
        }).then(function successCallback(response) {
            $scope.forecasts = $scope.formatData(response.data.list);
        }, function errorCallback(response) {
            console.log("ERROR: " + response);
        });
    };

    // Function to parse the API response to a custom format and sorts all responses to corresponding weekday.
    $scope.formatData = function (data) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var index = 0;
        var flags = {};
        var tempArray = [];

        for (var i in data) {
            data[i].timeset = [];
            var time = {};
            var startHour = new Date(data[i].dt * 1000).getHours();
            var endHour = parseInt(startHour + 2);

            if (endHour === 25) endHour = 1;

            data[i].weekday = days[new Date(data[i].dt * 1000).getDay()];

            if (!flags[data[i].weekday]) {
                flags[data[i].weekday] = true;
                data[i].dt_txt = data[i].dt_txt.split(" ")[0];
                time.temp = Math.round(data[i].main.temp);
                time.hour = startHour + ":00 - " + endHour + ":00";
                time.weather = data[i].weather[0].description;
                data[i].timeset.push(time);
                tempArray.push(data[i]);
                index++;
            }
            else {
                if (data[i].weather[0].id === 500) tempArray[index - 1].weather[0].id = 500;
                tempArray[index - 1].main.temp = Math.round((tempArray[index - 1].main.temp + data[i].main.temp) / 2);
                time.temp = Math.round(data[i].main.temp);
                time.hour = startHour + ":00 - " + endHour + ":00";
                time.weather = data[i].weather[0].description;
                tempArray[index - 1].timeset.push(time);
            }
        }
        return tempArray;
    };
});