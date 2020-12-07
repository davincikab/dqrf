mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

var alertId;
var allAlerts = [];
var viewAllRecords = document.getElementById('all-records');
var declineAlerts = document.querySelectorAll(".decline");
var respondAlerts = document.querySelectorAll('.response');
var alerts = document.querySelectorAll(".view");

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: {lng: 36.948670, lat: 0.2227716},
    zoom: 14.4
});

let popup = new mapboxgl.Popup()
    .setHTML(element);

let marker = new mapboxgl.Marker()
    .setLngLat([36.948670, -0.4227716770])
    .setPopup(popup)
    .addTo(map);


map.on('load', function(e) {
    // add map layers
    
});

