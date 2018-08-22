/*
Mark Kuhn
ICT-4510 Advanced Web Design and Management
Fall 2017

This script does several things.  First it calls slick js to produce a carousel on the home page.
It then creates a google map on the About page.  On the Menu page, it makes an ajax get request
to retrieve a json file where the menu items, ingredients, and price are stored.  It then creates
HTML elements and places this data beautifully on the page.  This script then utilizes Flickr's 
API to retrieve another json file which is then used to display images on the page.  Then lastly it utilizes jQuery's form validation API to apply rules to the contact form's input values.  On submit we post the request to the server which returns a success message.
*/

$(document).ready(function() {
    var carousel = $('.carousel').get(0);
    if(carousel) {
        $('.carousel').slick({
            accessibility: true,
            autoplay: true,
            arrows: false,
            dots: true,
            autoplaySpeed: 3000
        });
    }
    
    function showGoogleMap(coords) {
        var latitude = 39.678121;
        var longitude = -104.961753;
        var googleLatAndLong = new google.maps.LatLng(latitude, longitude);
        
        var mapSettings = {
            zoom: 12,
            center: googleLatAndLong,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        
        var divForMap = document.getElementById('map');
       
        var map = new google.maps.Map(divForMap, mapSettings);
        
        var title = "Our Location";
        var content = "We are here: " + latitude + ", " + longitude;
        
        addMarkerToGoogleMap(map, googleLatAndLong, title, content);
    }
    
    function addMarkerToGoogleMap(map, latlong, title, content) {
        var markerSettings = {
            position: latlong,
            map: map,
            title: title,
            clickable: true
        };
        
        var marker = new google.maps.Marker(markerSettings);
        
        var infoWindowSettings = {
            content: content,
            position: latlong
        };
        
        var infoWindow = new google.maps.InfoWindow(infoWindowSettings);
        
        google.maps.event.addListener(marker, "click", function() {
            infoWindow.open(map);
        });
    }
    
    var hasMap = $('#map').get(0);
    if(hasMap) {
        showGoogleMap();
    }
    
    //Get JSON file for Menu and then process the data into HTML
    if(localStorage.menuData) {
        var menuDataString = localStorage.getItem('menuData');
        var menuDataObject = JSON.parse(menuDataString);
        console.log('localStorage');
        createMenuHTML(menuDataObject);
    } else {
        $.getJSON('js/menu.json', function(json) {
            var menuData = json;
            var menuString = JSON.stringify(menuData);
            localStorage.setItem('menuData', menuString);
            console.log('JSON');
            createMenuHTML(menuData);
        });
    }
    
    function createMenuHTML(menuData) {
        for(let i=0; i<menuData.burgers.length; i++) {
            var div = $('<div></div>').attr('class', 'burgers');
            var h3 = $('<h3></h3>').text(menuData.burgers[i].burger + ' $' + menuData.burgers[i].price);
            var p = $('<p></p>').text(menuData.burgers[i].ingredients);
            div.append(h3).append(p);
            $('#burger-container').append(div);
        }
        
        for(let i=0; i<menuData.sandwiches.length; i++) {
            var div = $('<div></div>').attr('class', 'sandwiches');
            var h3 = $('<h3></h3>').text(menuData.sandwiches[i].sandwich + ' $' + menuData.burgers[i].price);
            var p = $('<p></p>').text(menuData.sandwiches[i].ingredients);
            div.append(h3).append(p);
            $('#sandwich-container').append(div);
        }
    }
    
    function flickrGallery(flickrJSON) {
        $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags=restaurants&format=json&jsoncallback=?', function (data) {
            for(let i=0; i<data.items.length; i++) {
                var div = $('<div></div>').attr('class', 'flickr-image');
                var img = $('<img></img>').attr('src', data.items[i].media.m);
                div.append(img);
                flickrGal.append(div);
            }    
        });
        
    }
    
    var flickrGal = $('.flickr-gallery');
    if(flickrGal) {
        flickrGallery();
    }
    
    var hasContactForm = $('#contact-form').get(0);
    if(hasContactForm) {
        $('#contact-form').validate({
            submitHandler: function() {
                var values = getFormValues();
                console.log(values);
                var url = 'process.php';
                $.post(url, values, function (json) {
                    displaySubmissionMessage(json);
                });
            },
            rules: {
                name: {
                    required: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    minlength: 8,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 7
                }
            },
            messages: {
                name: {
                    required: "Please enter your name",
                    minlength: "Name must be more than two characters"
                },
                email: {
                    required: "Please enter your email address",
                    minlength: "Email should be at least 8 characters",
                    email: "Please enter a valid email address"
                },
                message: {
                    required: "You must provide a message",
                    minlength: "Your message should be at least 8 characters"
                }
            }
        });
    }
    
    function getFormValues() {
        var formObject = {
            name: $('#fullname').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };
        return formObject;
    }
    
    function displaySubmissionMessage (json) {
		var display = $('#contact-form');
        console.log('inside displayMessage function');
		var data = '<p>' + json.message + '</p>';
		
		display.empty().append(data);
	}
    
});
    