var baseUrl = "http://api.openweathermap.org/data/2.5/weather?lat=";
var baseUrlSearch = "http://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "&APPID=41908feddfbb733e27c58b351a12146a";
var ipLocatorApi = "http://ip-api.com/json";
var cityArray = [];
var json;
$.getJSON("cities.json",function(data){
    json = data;
});
var cssClasses = [".cloudy",".rainy",".sunny",".thunder",".snowy",".windy"];

var mainApp = angular.module('mainApp',[]).config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist([ipLocatorApi,baseUrl]);
});


mainApp.controller('mainCtrl',['$scope','$http',function($scope,$http){
        
        var units = "&units=metric";
        $scope.localOrNon = "Local Weather";
        
           navigator.geolocation.getCurrentPosition(function(position) {
           var lat = position.coords.latitude;
           var lon = position.coords.longitude;
           var bridge = "&lon=";
           $http.get(baseUrl+lat+bridge+lon+units+apiKey).success(connectionSuccess);
        });
    
    function connectionSuccess(data){
        for(var cs in cssClasses){
            $(cssClasses[cs]).css('display','none');
        }
        setup();
        $scope.city = data.name;
        var id = data.weather[0].id;
        var cssClass = weatherDecode(id);
        $(cssClass).css({display:'block'});
        $scope.weather = toTitleCase(data.weather[0].description);
        $scope.temperature = Math.round(data.main.temp)+"°C";
    }
    
    $(document).on("keydown",function(e){
      if(e.keyCode===13){
          if($(".searchBox").is(":focus")){
              $scope.connectCity();
          }
      }
      
      $scope.connectCity = function(){
          var location = $(".searchBox").val();
          $http.get(baseUrlSearch+location+units+apiKey).success(connectionSuccess);
          $scope.localOrNon = "Non Local Weather";
      };
   });
    
}]);

mainApp.controller('cityCtrl',['$scope',function($scope){
        $scope.cityList = cityArray;
        
        $(".searchBox").on('input',function(){
            if($(this).val()){
                filterCities($(this).val());
                $scope.cityList = cityArray;
                $scope.$apply();
            }else{
            reset();
            }
        });
        
        //reset city array on blur so that the list disappears
        $(".searchBox").on('blur',function(){
            $("ol").mouseleave(function(){
                reset();
            });
        });
        
        function reset(){
            cityArray = [];
            $scope.cityList = cityArray;
            $scope.$apply();
        }
        
        //replaces search text with what the user clicks on
        $scope.replaceSearchText = function(t){
            $(".searchBox").val(t);
            $scope.$parent.connectCity();
           };
}]);

//converting api weather codes to css class names
function weatherDecode(i){
    var weather = "";
    
    if(i>=200&&i<=232)
        weather = "thunder";
    if(i>=300&&i<=321)
        weather = "rainy";
    if(i>=500&&i<=531)
        weather = "rainy";
    if(i>=600&&i<=622)
        weather = "snowy";
    if(i>=701&&i<=781)
        weather = "cloudy";
    if(i===800)
        weather = "sun";
    if(i>=801&&i<=804)
        weather = "cloudy";
    if(i>=900&&i<=906)
        weather = "thunder";
    if(i>=951&&i<=962)
        weather = "windy";
    
    return "."+weather;
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//match cities on search
function filterCities(text){
    var cityText = text;
    var count = 0;
    cityArray = [];
    for(var key in json){
        if(count>=3)
            break;
        if(json[key].city.toLowerCase().indexOf(cityText.toLowerCase())>=0){
            cityArray.push(json[key]);
            count++;
        }
    }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//events
$(document).ready(function(){
   $(".fa-search").click(function(){
       $(".searchBox").css('display','block');
       $(".searchBox").focus();
       $(this).fadeOut(500,function(){
           setTimeout(function(){
               $(".searchBox").css({display:'block',width: '210px'});
           },100);
       });
   });
   $(document).on('keydown',function(e){
       var current;
       if(e.keyCode===40){
           if($(".listDiv").hasClass("active")){
               current = $(".listDiv.active");
               current.parent().next().find(".listDiv").addClass("active");
               current.removeClass("active");
               current = $(".listDiv.active");
           }else{
               current = $(".listDiv:first");
               current.addClass("active");
           }
           setTextFromList(current.find("p").html());
       }
   });
   $(document).on('keyup',function(e){
       var current;
       if(e.keyCode===38){
           if($(".listDiv").hasClass("active")){
               current = $(".listDiv.active");
               current.parent().prev().find(".listDiv").addClass("active");
               current.removeClass("active");
               current = $(".listDiv.active");;
           }else{
               current = $(".listDiv:first");
               current.addClass("active");
           }
           setTextFromList(current.find("p").html());
       }
   });
});

//set text to input search box
function setTextFromList(t){
    $(".searchBox").val(t);
}