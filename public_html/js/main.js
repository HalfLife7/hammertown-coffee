// http://www.unbolt.net/geocode_convertor.php
// manually got lat/lng since open data only had addresses
// could not automate with geocode upon opening webpage since api limited geocode queries to 11/sec?

// defining variables
currentLat = 0;
currentLong = 0;
var map;
coffeeData = [];

$.getJSON("ajax/coffeeData.json",
        function (data) {
            coffeeData = data;
        });

// js to run when document is done loading
$(document).ready(function () {


    // hide sidebar stuff when site first opens
    $(document.getElementById("namePanel")).hide();
    $(document.getElementById("stars")).hide();
    $(document.getElementById("photoPanel")).hide();
    $(document.getElementById("reviewsPanel")).hide();

    $('.carousel').carousel();

    // create default map centered around downtown hamilton
    function initialize() {
        geocoder = new google.maps.Geocoder();
        infoWindow = new google.maps.InfoWindow;
        var latlng = new google.maps.LatLng(43.2557, -79.8711);
        var mapOptions = {
            center: latlng,
            div: '#map',
            zoom: 15,
            gestureHandling: 'greedy',
            disableDefaultUI: true
        }
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }
    initialize();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Current location.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
    setTimeout(function () {
        $.each(coffeeData, function (key, val) {

            var marker = new google.maps.Marker({
                position: {lat: val.latitude, lng: val.longitude},
                lat: val.latitude,
                lng: val.longitude,
                address: val.address,
                map: map
            });

            google.maps.event.addListener(marker, 'click', function () {

                // get place_id using geocoder with lat/lng of the marker clicked
                geocoder.geocode({'location': {lat: this.lat, lng: this.lng}}, function (results, status) {
                    if (status === 'OK') {
                        marker.placeID = results[0].place_id;
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });

                // https://developers.google.com/maps/documentation/javascript/places
                var place = new google.maps.LatLng(this.lat, this.lng);

                // https://developers.google.com/places/supported_types
                var request = {
                    location: place,
                    radius: '40',
                    query: 'coffee',
                    type: 'cafe'
                };

                // get place details using the placeID
                var service = new google.maps.places.PlacesService(map);
                service.textSearch(request, callback);

            });
        });
    }, 1000);


    function callback(results, status) {
        var service = new google.maps.places.PlacesService(map);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < 1; i++) {
                var request = {placeId: results[0].place_id};

                service.getDetails(request, function (request, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        console.log(request);
                        placeData(request);
                        // call function to get place data and update html with data

                    }
                });
            }
        }
    }

    function placeData(place) {
        // show side bar stuff upon clicking a marker
        $(document.getElementById("greetings")).hide();
        $(document.getElementById("namePanel")).show();
        $(document.getElementById("stars")).show();
        $(document.getElementById("photoPanel")).show();
        $(document.getElementById("reviewsPanel")).show();
        // update name
        if (place.hasOwnProperty("name")) {
            $(document.getElementById('name')).show();
            $(document.getElementById('name')).html(place.name + '<a type="button" id="directionsButton" class="btn btn-primary" href="https://www.google.ca/maps/dir//' + place.name + " " + place.formatted_address + '"> Directions</button>');
        } else {
            $(document.getElementById('name')).hide();
        }

        // update address
        if (place.hasOwnProperty("formatted_address")) {
            $(document.getElementById('formattedAddress')).show();
            $(document.getElementById('formattedAddress')).html('<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>' + place.formatted_address);
        } else {
            $(document.getElementById('formattedAddress')).hide();
        }

        // update phone number
        if (place.hasOwnProperty("formatted_phone_number")) {
            $(document.getElementById('formattedPhoneNumber')).show();
            $(document.getElementById('formattedPhoneNumber')).html('<span class="glyphicon glyphicon-earphone" aria-hidden="true"></span>' + place.formatted_phone_number);
        } else {
            $(document.getElementById('formattedPhoneNumber')).hide();
        }

        // update website
        if (place.hasOwnProperty("website")) {
            $(document.getElementById('website')).show();
            $(document.getElementById('website')).html('<span class="glyphicon glyphicon-globe" aria-hidden="true"></span><a href="' + place.website + '" title="Open Website">' + place.website);
        } else {
            $(document.getElementById('website')).hide();
        }

        // update ratings
        // https://stackoverflow.com/questions/1987524/turn-a-number-into-star-rating-display-using-jquery-and-css - code to turn ratings into stars
        if (place.hasOwnProperty("rating")) {
            $(document.getElementById('stars')).show();
            $(document.getElementById('stars')).html(place.rating);
            if (place.rating >= 3) {
                $(document.getElementById('rating')).html('<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>' + place.rating);
            } else if (place.rating < 3) {
                $(document.getElementById('rating')).html('<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>' + place.rating);
            }
            $(function () {
                $('span.stars').stars();
            });
        } else {
            $(document.getElementById('stars')).hide();
        }

        // clear previous reviews before updating it
        $(document.getElementById('reviewBody')).empty();
        // update reviews
        if (place.hasOwnProperty("reviews")) {
            $(document.getElementById('reviewBody')).show();
            for (i = 0; i < 5; i++) {
                if (place.reviews.hasOwnProperty(i)) {
                    $(document.getElementById('reviewBody')).append('<div class="media">');
                    $(document.getElementById('reviewBody')).append('<img id="reviewProfilePhoto' + i + '" class="media-object reviewPhoto" src="' + place.reviews[i].profile_photo_url + '" alt="">');
                    $(document.getElementById('reviewBody')).append('</a>');
                    $(document.getElementById('reviewBody')).append('</div>');
                    $(document.getElementById('reviewBody')).append('<div class="media-body">');
                    $(document.getElementById('reviewBody')).append('<h4 class="media-heading reviewName" id="reviewAuthorName' + i + '">' + place.reviews[i].author_name + '</h4>');
                    $(document.getElementById('reviewBody')).append('<p class="reviewRating"><span class="stars" id="reviewRating' + i + '">' + place.reviews[i].rating + '/5 </span><span id="reviewRelativeTime' + i + '"> <br>' + place.reviews[i].relative_time_description + '</span></p>');
                    $(document.getElementById('reviewBody')).append('<p class="reviewText" id="reviewText' + i + '">' + place.reviews[i].text + '</p>');
                    $(document.getElementById('reviewBody')).append('</div>');
                    $(document.getElementById('reviewBody')).append('</div>');
                }
            }
        } else {
            $(document.getElementById('reviewBody')).hide();
        }

        // update photos
        $('.carousel').carousel('pause');
        // clear previous reviews before updating it
        $(document.getElementById('indicators')).empty();
        $(document.getElementById('carouselPhotos')).empty();
        // update reviews
        if (place.hasOwnProperty("photos")) {
            $(document.getElementById('photoCarousel')).show();
            if (place.photos.hasOwnProperty(0)) {
                $(document.getElementById('indicators')).append('<li data-target="#photoCarousel" data-slide-to="0" class="active"></li>');
                // not updating dom in one line causes carousel errors
                $(document.getElementById('carouselPhotos')).append('<div class="item active"><img id="carouselPhoto0" class="d-block w-100" src="' + place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) + '" alt=""></div>');
            }
            $('.carousel').carousel(0);
            for (i = 1; i < place.photos.length; i++) {
                if (place.photos.hasOwnProperty(i)) {
                    $(document.getElementById('indicators')).append('<li data-target="#photoCarousel" data-slide-to="' + i + '"></li>');
                    // not updating dom in one line causes carousel errors
                    $(document.getElementById('carouselPhotos')).append('<div class="item"><img id="carouselPhoto0" class="d-block w-100" src="' + place.photos[i].getUrl({'maxWidth': 400, 'maxHeight': 400}) + '" alt=""></div>');
                }
            }
        } else {
            $(document.getElementById('photoCarousel')).hide();
        }
        $('.carousel').carousel('next');
    }
    $.fn.stars = function () {
        return $(this).each(function () {
            // Get the value
            var val = parseFloat($(this).html());
            // Make sure that the value is in 0 - 5 range, multiply to get width
            var size = Math.max(0, (Math.min(5, val))) * 16;
            // Create stars holder
            var $span = $('<span />').width(size);
            // Replace the numerical value with stars
            $(this).html($span);
        });
    };
    //https://developers.google.com/maps/documentation/javascript/places#places_photos
});
