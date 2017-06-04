  var panorama;
  var geocoder;
  var map;
  var newtemp;
  var gmarkers = [];
  $(function() {
      initialize();
      $(".alert").hide();
  });

  function initialize() {
      geocoder = new google.maps.Geocoder();
      getpanorama();
      getStreetview(new google.maps.LatLng(37.86926, -122.254811), panorama);
      map = new google.maps.Map(document.getElementById('map'), {
          center: {
              lat: 37.86926,
              lng: -122.254811
          },
          zoom: 10,
          mapTypeControl: false,
          panControl: false,
          streetViewControl: true,
          streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_CENTER
          },
          zoomControl: true,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.LEFT_CENTER
          },
          mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      map.setStreetView(panorama);
      panorama.addListener('position_changed', function() {
          SetWeather(panorama.getPosition());
      });

      SetWeather(new google.maps.LatLng(37.86926, -122.254811));
      var centerControlDiv = document.createElement('div');
      centerControlDiv.className = "search";
      var centerControl = new addSearch(centerControlDiv, map);
      centerControlDiv.index = 10;
      map.controls[google.maps.ControlPosition.TOP_LEFT]
          .push(centerControlDiv);
  }



  function changeforamat(format) {
      if (format == 'C') {
          $("#temperature").text(newtemp);
      } else {
          $("#temperature").text(Math.round(9 / 5 * newtemp + 32))
      }
  }

  function addSearch(controlDiv, map) {
      var controlUI = document.createElement('div');
      controlDiv.appendChild(controlUI);
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.innerHTML = '<div class="row"><div class="col-lg-8"><input type="text" id="address" class="form-control" placeholder="Search your city"></div><a onclick="javascript:return getSearch();" class="button button-primary button-box button-small"><i class="fa fa-search"></i></a><a onclick="javascript:return getCurrent();" class="button button-primary button-box button-small"><i class="fa fa-location-arrow"></i></a><a onclick="javascript:return showWeather();" class="button button-primary button-box button-small"><i class="fa fa-street-view"></i></a></div>';
      controlUI.appendChild(controlText);
  }

  function setCity() {
      $("#address").val();
  }

  function showError(message) {
      $(".alert-danger").text(message).css("height", 100).show(10).delay(1000).hide(10);
  }

  function getpanorama() {
      panorama = new google.maps.StreetViewPanorama(
          document.getElementById('street-view'), {
              pov: {
                  heading: 165,
                  pitch: 0
              },
              zoom: 1,
              //                    disableDefaultUI: true,
          });
  }

  function showWeather() {
      $(".col-xs-5").toggleClass("active");
  }

  function getStreetview(latLng, panorama) {
      var streetViewService = new google.maps.StreetViewService();
      var STREETVIEW_MAX_DISTANCE = 100;
      streetViewService.getPanoramaByLocation(latLng, STREETVIEW_MAX_DISTANCE, function(streetViewPanoramaData, status) {
          if (status === google.maps.StreetViewStatus.OK) {
              panorama.setPosition(streetViewPanoramaData.location.latLng);
          } else {
              showError("No available Street view!");
          }
      });
  }

  function getCurrent() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              panorama.setPosition(pos);
              map.setCenter(pos);
              map.setStreetView(panorama);
          }, function() {
              handleLocationError(true, panorama.getPosition());
          });
      } else {
          handleLocationError(false, panorama.getPosition());
      }
  }

  function SetWeather(geolocation) {
      var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + geolocation.lat() + "&lon=" + geolocation.lng();;
      console.log(geolocation);
      $.getJSON(url, function(data) {
          if (data.cod == '200') {
              $("#city").text(data.name + ', ' + data.sys.country);
              $("#temperature").text(Math.round(data.main.temp - 273.15));
              newtemp = Math.round(data.main.temp - 273.15);
              $("#humidity").text(' ' + data.main.humidity);
              $("#description").text(data.weather[0].description);
              getwindD(data.wind.deg);
              $("#speed-unit").text(data.wind.speed + '  km/h');
          } else {
              showError("Sorry,can't get the weather of your city!");
          }
      });
  }

  function getwindD(windDegree) {
      if (windDegree > 337.5 || windDegree <= 22.5) {
          $("#wind-direction").text('N');
      } else if (22.5 < windDegree <= 67.5) {
          $("#wind-direction").text('NE');
      } else if (67.5 < windDegree <= 112.5) {
          $("#wind-direction").text('E');
      } else if (112.5 < windDegree <= 157.5) {
          $("#wind-direction").text('SE');
      } else if (157.5 < windDegree <= 202.5) {
          $("#wind-direction").text('S');
      } else if (202.5 < windDegree <= 247.5) {
          $("#wind-direction").text('SW');
      } else if (247.5 < windDegree <= 292.5) {
          $("#wind-direction").text('W');
      } else if (292.5 < windDegree <= 337.5) {
          $("#wind-direction").text('NW');
      }

  }

  function getSearch(address) {
      var address = document.getElementById('address').value;
      geocoder.geocode({
          'address': address
      }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
              var chooseaddress = results[0].formatted_address;
              getStreetview(results[0].geometry.location, panorama);
              SetWeather(results[0].geometry.location);
              map.setCenter(results[0].geometry.location);
          } else {
              showError("Sorry,can't find your city!");
          }
      });
  }

  function handleLocationError(browserHasGeolocation, pos) {
      panorama.setPosition(pos);
      showError("Can't get Current location!");
  };