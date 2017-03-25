var apiKey = "f624f6117e117acb027529277c71bfb3";

var weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

var unit = "metric";

$(document).ready(function() {
  getLocation();
  
  $('#change').click(function() {
    change();
  });
});

// Get user location via Geolocation API
function getLocation() {
  $.ajax({
    url: 'http://ip-api.com/json',
    method: 'GET',
    data: {},
    dataType: 'json',
    success: function(data) {
      $city = data.city + ',' + data.countryCode;
      
      setCurrent($city);
      setForecast($city);
    },
    // Error Handler
    error: function(err) {
      console.log(err);
    }
  });
}

// Add a darker mask to the body and helps draw the elements in main box.
function draw(value) {
  $('body').css('background-image','rgba(90, 90, 90, .5)');
}

// Populate main box and change BG according to the case.
function setStatus(status) {
  switch(status) {
      
    case 'Rain': $('#icon').append('<i class="wi wi-rain-mix"></i>');
      $('#status').html('Rain');
      $('body').css('background-image','url("vendor/img/bg-1.jpg")');
      break;

    case 'Drizzle': $('#icon').append('<i class="wi wi-rain-mix"></i>');
      $('#status').html('Drizzle');
      $('body').css('background-image','url("vendor/img/bg-2.jpg")'); 
      break;

    case 'Clear': $('#icon').append('<i class="wi wi-day-sunny"></i>');
      $('#status').html('Clear');
      $('body').css('background-image','url("vendor/img/bg-3.jpg")');
      break;

    case 'Clouds': $('#icon').append('<i class="wi wi-cloudy"></i>');
      $('#status').html('Clouds');
      $('body').css('background-image','url("vendor/img/bg-4.jpg")');
      break;

    case 'Thunderstorm': $('#icon').append('<i class="wi wi-storm-showers"></i>');
      $('#status').html('Thunderstorm');
      $('body').css('background-image','url("vendor/img/bg-5.jpg")');
      break;

    case 'Snow': $('#icon').append('<i class="wi wi-snow"></i>');
      $('#status').html('Snow');
      $('body').css('background-image','url("vendor/img/bg-6.jpg")');
      break;

    case 'Mist': $('#icon').append('<i class="wi wi-smoke"></i>');
      $('#status').html('Mist');
      $('body').css('background-image','url("vendor/img/bg-7.jpg")');
      break;

    case 'Fog': $('#icon').append('<i class="wi wi-fog"></i>');
      $('#status').html('Fog');
      $('body').css('background-image','url("vendor/img/bg-8.jpg")');
      break;
      
  }
}

// Get proper Icon according the case
function getIcon(weather) { // muda o icone do clima no DOM 
  switch(weather){
    case 'Rain': return '<i class="wi wi-rain-mix"></i>';
    case 'Drizzle': return '<i class="wi wi-rain-mix"></i>';
    case 'Clouds': return '<i class="wi wi-cloudy"></i>';
    case 'Clear': return '<i class="wi wi-day-sunny"></i>';
    case 'Thunderstorm': return '<i class="wi wi-storm-showers"></i>';
    case 'Snow': return '<i class="wi wi-snow"></i>';
    case 'Haze': return '<i class="wi wi-smoke"></i>';
    case 'Fog': return '<i class="wi wi-fog"></i>';
    case 'Mist': return '<i class="wi wi-fog"></i>';
      
    default: return '<i class="wi wi-time-1"></i>';
  }
}

// Provide city data from api.
function setCurrent(city) { 
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + apiKey,
    method: 'GET',
    data: {},
    dataType: 'json',
    success: function(data){
      
      // Provide the value for draw function
      draw(data.main.temp);
      
      // Populate city
      $('#city').empty();
      $('#city').append(city.substring(0,city.indexOf(',')));
      $('#temp').empty();
      
      // Provide the icon according the case
      if ($('#icon').is(':empty')) {
        setStatus(data.weather[0].main);
      }
      
      // Provide current temperature
      if ($('#temp').is(':empty')) {
        $('#temp').append(convert(data.main.temp));
      }
      
      // Add Unit to change to the button
      if ($('#change').is(':empty')) {
        $('#change').append('°F');
      }
    }
  });
}

// Get forecast data for week days
function setForecast(city, reason) {
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + ',de&mode=json&appid=' + apiKey,
    method: 'GET',
    data: {},
    dataType: 'json',
    success: function(data) {
      $('#forecast').empty();
      var date = new Date();
      var dayCounter = date.getDay();
      
      for (var i = 0; i <= 4; i++) {
        if (dayCounter >= weekDays.length -1) {
          dayCounter = 0;
        } else {
          dayCounter += 1;
        }
        
        if (data.list[i].weather[0].main !== '' && reason !== 'refresh') {
          $('#week-days').append(weekDays[dayCounter] + '&nbsp;');
          $('.icons').append(getIcon(data.list[i].weather[0].main) + '&nbsp;');
        }
        
        $('#forecast').append(convert(data.list[i].temp.max) + '&nbsp;');
      }
    }
  });
}

// Convert °C to °F
function convert(val, reason) {
  if (unit === "metric") {
    return Math.round(val - 273.15) + "°c";
    
  } else {
    return Math.round((val - 273.15) * 1.8000 + 32.00) + "ºf";
    
  }
}

// Switch between ºC and ºF
function change() {
  $('#change').empty();
  
  if (unit === 'metric') {
    $('#change').append('°C');
    
    setForecast($city, 'refresh');
    setCurrent($city);
    unit = 'imperial';
    
  } else {
    $('#change').append('°F');
    
    setForecast($city, 'refresh');
    setCurrent($city);
    unit = 'metric';
  }
}

// Search functions and calls
$('#search').autocomplete({
  source: function(request, response) {
    $.getJSON("http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
      function(data) {
        return data[0] === '' ? response(close()) : response(data);
      }
    );
  },
  
  minLength: 3,
  appendTo: '.form-group',
  
  select: function(x, y) {
    changeCity(y.item.value);
  }
  
});

// Change City by Search
function changeCity(city) {
  $.ajax({
    url: 'http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=' + city,
    dataType: 'json',
    success: function(data) {
      $city = data.geobytescity + ',' + data.geobytesinternet +
      ',' + data.geobytesregionlocationcode.substring(2,5);
      $('#icon').empty();
      $('.icons').empty();
      $('#week-days').empty();
      
      setCurrent($city);
      setForecast($city);
    }
  });
}