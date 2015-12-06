/* Homer client js */

//var css = require('./app.css')
//console.log(css);

angular.module('app', ['ui.bootstrap']);


app.controller('HomerRoot', ['$scope', function($scope) {
  $scope.greeting = 'Doh!';
}]);


window.onload = function () {
 

 /* var url, i;

  $('#input').append('Beer:')
  //for (i = 0; i < 2; i++) {
    url = document.URL + 'getsensordata/';
    $.getJSON(url, function (data) {
      console.log(data);
      data.forEach(function(part){
      console.log(part);
        $('#input').append('<p> temp ' + part.temp + 'C,  hum ' + part.humidity + '%</p>');

      });   
    });*/



   /* url = document.URL + 'inputs/';
    $.getJSON(url, function (data) {
      console.log(data);
      data.forEach(function(part){
      console.log(part);
      	$('#input').append('<p>input gpio port ' + part.gpio + ' has current value ' + part.value + '</p>');

      });  	
    });
  //}*/

  
};