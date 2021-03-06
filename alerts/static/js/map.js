mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

var alertId;
var allAlerts = [];
var viewAllRecords = document.getElementById('all-records');
var declineAlerts = document.querySelectorAll(".decline");
var respondAlerts = document.querySelectorAll('.response');
var alerts = document.querySelectorAll(".view");
var refreshAlerts = document.getElementById("refresh-alerts");

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: {lng: 36.96182641058272, lat: -0.3952534846158784},
    zoom: 15.4
});

// directions control
var STATION_COORDINATES = [36.95880310720918, -0.39338499245063474];
var directionControl = new MapboxDirections({
    interactive:false,
    accessToken: mapboxgl.accessToken
});

map.addControl(directionControl, 'top-right');

map.on('load', function(e) {
    // add map layers
    fetchAlerts();

    // alerts heatmap
    // forest layer
    map.addSource('forest', {
        'type':'geojson',
        'data':{
            'type':'FeatureCollection',
            'features':[]
        }
    });

    map.addLayer({
        'id':'forest',
        'source':'forest',
        'type':'fill',
        'paint':{
            'fill-color':'green',
        },
        'layout':{
            'visibility':'none'
        }
    });

    // fetch forest data
    fetch('/static/data/forest.pbf', { responseType:'ArrayBuffer'})
    .then(res => res.arrayBuffer())
    .then(data => {
        console.log("PBF file");
        console.log(data);

        var geojson = geobuf.decode(new Pbf(data));
        geojson = turf.featureCollection(geojson.features);

        console.log(geojson);
        // console.log(geojson);
        map.getSource('forest').setData(geojson);
    })
    .catch(error => {
        console.error(error);
    });

    map.addSource('plantation', {
        'type':'geojson',
        'data':{
            'type':'FeatureCollection',
            'features':[]
        }
    });

    map.addLayer({
        'id':'plantation',
        'source':'plantation',
        'type':'fill',
        'paint':{
            'fill-color':'#938446',
        },
        'layout':{
            'visibility':'none'
        }
    });

    // fetch forest data
    fetch('/static/data/plantation.pbf', { responseType:'ArrayBuffer'})
    .then(res => res.arrayBuffer())
    .then(data => {
        console.log("PBF file");
        console.log(data);

        var geojson = geobuf.decode(new Pbf(data));
        geojson = turf.featureCollection(geojson.features);

        console.log(geojson);
        // console.log(geojson);
        map.getSource('plantation').setData(geojson);
    })
    .catch(error => {
        console.error(error);
    });
});

function fetchAlerts(){
    fetch("/api/v1/")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        allAlerts = data.features;

        // create the markers and the respective popup  
        renderMarkers(allAlerts);
        renderAlertListings(allAlerts);

        // query all the cards
        declineAlerts = document.querySelectorAll(".decline");
        respondAlerts = document.querySelectorAll('.response');
        alerts = document.querySelectorAll(".view");

        // register event listeners
        registerListeners();
    })
    .catch(error  => {
        console.error(error)
    });

    // accident spots
    map.addSource('accidentspots', {
        'type':'geojson',
        'data':'/static/data/accidentspot.geojson'
    });

    map.addLayer({
        'id':'accidentspots',
        'source':'accidentspots',
        'type':'line',
        'paint':{
            'line-color':[
                'match',
                ['get', 'gridcode'],
                3,
                'brown',
                2,
                'red',
                1,
                'gray',
                'gray'
            ],
            'line-width':4
        },
        'layout':{
            'visibility':'visible'
        }
    });
}

function renderAlertListings(features) {
    let docFragment = document.createDocumentFragment();

    features.forEach(feature => {
        let element = renderAlertListing(feature);
        docFragment.append(element);
    });

    $('#alerts-section').append(docFragment);
}

function renderAlertListing(feature) {
    let element = document.createElement("div");
    element.classList.add('card');
    element.id = 'alert-' + feature.properties.pk;
    element.setAttribute('data-alert-id', feature.properties.pk);

    element.innerHTML = cardElement(feature);

    element.addEventListener('mouseover', function(e) {
        this.classList.add('active');
        let alertId = this.getAttribute('data-alert-id');
        let alert = getAlertById(alertId);

        map.easeTo({
            center:alert.geometry.coordinates,
            zoom:16
        });

        // console.log(this.classList);
    });

    element.addEventListener('mouseout', function(e) {
        this.classList.remove('active');
    });

    return element;
}

function renderMarkers(features) {
    features.forEach(feature => {
        renderMarker(feature);
    });

}

function renderMarker(feature) {
    let element = '<div class="">'+ 
    '<h6 class="card-title text-black">'+
        feature.properties.emergency_type +
        '<br><small><i class="fa fa-map-marker mr-1"></i>'+ feature.properties.location_name +'</small>' +
    '</h6>'+ 
    '<p><i class="fa fa-user mr-1"></i>'+ feature.properties.username +'</p>'+
    '<div class="d-flex">'+
    '<button class="btn btn-outline-primary btn-sm" onclick="toggleSideTab()">View</button>'+
    '<button class="btn btn-outline-primary btn-sm ml-2" onclick="getDirection(['+ feature.geometry.coordinates +'])">Get Directions</button>'+
    '</div>'+
    '</div>';

    let popup = new mapboxgl.Popup()
        .setHTML(element);
    
    popup.on("open", function(e) {
        console.log("popup open");
        console.log(feature);

        let innerHtml = updateSideTabContent(feature);
        $('#side-tab-body').html(innerHtml);

        // toggle side-tab right
        // $('#side-tab').removeClass('d-none');
    });

    // custom marker element
    let divMarker = document.createElement('div');
    divMarker.classList.add('marker-element');
    divMarker.innerHTML = '<i class="fa fa-info"></i>'

    let status = feature.properties.status; 

    let marker = new mapboxgl.Marker({element:divMarker})
        .setLngLat(feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);
}

function getDirection(destination) {
    console.log(destination);
    directionControl.setOrigin(STATION_COORDINATES);
    directionControl.setDestination(destination);
}

function toggleSideTab() {
    $('#side-tab').removeClass('d-none');   
}

function cardElement(feature) {
    let time = new Date(feature.properties.time);

    return  '<div class="card-body mb-3">'+
    '<div class="card__header">'+
        '<i class="fa fa-plus mr-2 icon"></i>'+
        '<h6 class="card-title text-black">'+
            feature.properties.emergency_type +
            '<br><small><i class="fa fa-map-marker mr-1"></i>'+ feature.properties.location_name +'</small>' +
        '</h6>'+
    '</div>'+
    
    createCarousel(feature.properties.alert_image, feature.properties.pk) +
    '<div class="info">'+
        '<p class="badge">'+ feature.properties.status +'</p>'+
        '<p><i class="fa fa-user"></i>'+ feature.properties.username +'</p>'+
        '<p><i class="fa fa-calendar"></i>'+ monthNames[time.getMonth()] +" "+ time.getDay() +'</p>'+
    '</div>'+
    '<button class="btn btn-danger btn-sm mx-2 decline" data-alert-id="'+ feature.properties.pk +'">Decline</button>'+
    '<button class="btn btn-success btn-sm mr-1 response" data-alert-id="'+ feature.properties.pk +'">Respond</button>'+
    '<button class="btn btn-dark btn-sm mr-1 view" data-alert-id="'+ feature.properties.pk +'">View</button>'+
    '</div>';
}

function createCarousel(images, id) {

    let items = images.map((image , index) => {
        if(index == 0) {
            return '<div class="carousel-item active">' +
                '<img src="'+ image.image +'" class="d-block w-100" alt="...">'+
            '</div>'
        }

        return '<div class="carousel-item">' +
        '<img src="'+ image.image +'" class="d-block w-100" alt="...">'+
      '</div>'
    });

    if(images.length == 0) {
        return "";
    }

    let carouselId = "carousel-" + id;
    let carousel = `<div id="${carouselId}" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            ${items.join("")}
        </div>
        <a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
        </div>`;

        return carousel;
}

function registerListeners() {
    declineAlerts.forEach(declineAlert => {
        declineAlert.addEventListener('click', function(e){
            e.preventDefault();
                alertId = this.getAttribute("data-alert-id");
            // open decline modal
            let myModal = $('#decline-modal');
            myModal.modal('toggle');
            
            // connect to a websocket
             var submitButton = $("#decline");
             var inputMessage = $("#decline-field");
            let webSocket = connectToChatWebSocket(alertId, submitButton, inputMessage, myModal, true);
        });
    });

    respondAlerts.forEach(respondAlert => {
        respondAlert.addEventListener('click', function(e){
            e.preventDefault();
            alertId = this.getAttribute("data-alert-id");
            // open respond modal
            let myModal = $('#response-modal');
            myModal.modal('toggle');
            
            // connect to a websocket
            console.log("Home coming");
            var submitButton = $("#response");
            var inputMessage = $("#response-field");
            let webSocket = connectToChatWebSocket(alertId, submitButton, inputMessage, myModal, false);
        });
    });

    alerts.forEach(viewAlert => {
        viewAlert.addEventListener('click', function() {
            // display alert information
            alertId = this.getAttribute("data-alert-id");
            let alert = getAlertById(alertId);

            // update the side tab with emergency info
            let innerHtml = updateSideTabContent(alert);
            $('#side-tab-body').html(innerHtml);

            // toggle side-tab right
            $('#side-tab').removeClass('d-none');
            
        });
    });
}

function updateSideTabContent(feature) {
    let imageElement =  feature.properties.image ? '<img src="'+feature.properties.image +'" class="img"/>' : 
    '<p><i class="fa fa-plus fa-2x bg-white"></i></p><p>'+ feature.properties.emergency_type +'</p>';

    return '<div class="alert-header bg-primary text-center">'+
            '<div>'+ imageElement +'</div>'+
            '<p class="badge">Status '+ feature.properties.status +'</p>'+
       '</div>'+
       '<div class="alert-description">'+
            '<div class="info">'+
                '<div><i class="fa fa-info"></i>'+ feature.properties.location_name +'</div>'+
                '<div><i class="fa fa-phone"></i>+254789794774</div>'+
                '<div><i class="fa fa-home"></i>'+ feature.properties.location_name +', Nyeri, Kenya</div>'+
                '<div><i class="fa fa-calendar"></i>'+ feature.properties.time +'</div>'+
             '</div>'+
             '<div>'+ feature.properties.description +'</div>'+
             '<a href="/chat/room/'+ feature.properties.pk+'" class="btn btn-primary" >Chat Room</a>'+
        '</div>';
    
}

$('#close-btn').on('click', function(e) {
    $('#side-tab').addClass('d-none'); 
});

// send buttons
$('#response').on("click", e => {
    // check if the field is empty
    let value = $('#response-field').val();
    if(value == "") {
        //  snackbar error
        // toggleSnackbar("Can't send empty message", 'error');

        window.alert("Can't send and empty message");

        return;
    } 

    let alert = getAlertById(alertId);
    let alertResponse = {
        message:value,
        alert_id:alertId,
        sender:'admin',
        reciever:alert.reported_by,
        time:new Date().toISOString()
    }
});

$("#decline").on("click", (e) => {
    // check if the field is empty
    let value = $('#decline-field').val();
    if(value == "") {
        //  snackbar error
        // toggleSnackbar("Can't send empty message", 'error');

        window.alert("Can't send and empty message");
        return;
    } 

    let alert = getAlertById(alertId);
    let alertResponse = {
        message:value,
        alert_id:alertId,
        sender:'admin',
        reciever:alert.reported_by,
        time:new Date().toISOString()
    }
});

// send the messages
function sendMessage() {

}

// get alert by id
function getAlertById(id) {
    let alert = allAlerts.find(alert => alert.properties.pk == id);

    return alert;
}


function streamIncomingAlerts() {
    let marker = new mapboxgl.Marker({element})
        .setLngLat([36.748670, -0.4227716770])
        .setPopup(popup)
        .addTo(map);
}


$(viewAllRecords).on('click', function(e) {
    console.log(viewAllRecords.innerText);

    if(this.innerText.includes('New')) {
        $('#alerts-section').html("");

        renderAlertListings(allAlerts);
        viewAllRecords.innerHTML = '<i class="fa fa-eye"></i>View all Records';
        return;
    }

    // get the alerts
    requestAllAlerts('/alert_list/');

    // toggle the text content
    viewAllRecords.textContent = "View New Alerts";
});

function requestAllAlerts(url) {
    $.ajax({
        url:url,
        type:'GET',
        success:function(data) {
            // update the alerts sections
            $('#alerts-section').html(data);
        },
        error:function(error) {
            console.error(error);
        }
    })
}

$('#search-form').on('submit', function(e) {
    e.preventDefault();
    let url = '/alert_list/?q=' + $("#search").val();
    console.log(url);

    requestAllAlerts(url);
});

// create layer toggler
const overlayLayers = {
    // 'Alerts':'alerts',
    'Plantation':'plantation',
    'Forest':'forest',
    'Accident Spot':'accidentspots',
};

class LayerControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.className = 'mapboxgl-ctrl';
        this._container.classList.add("layer-control");

        // create a checkbox
        let layerNames = Object.keys(overlayLayers);
        layerNames.forEach(layerName => {
            let layer = overlayLayers[layerName];
            let input = document.createElement("input");
            input.className = "layer";
            input.setAttribute("type", "checkbox");

            input.name = "layer";
            input.id = layerName.toLowerCase();
            input.value = layer; 
            
            input.checked = map.getLayer(layer) && map.getLayoutProperty(layer, 'visiblility') == 'visible' ? true : false;
            input.checked = layer == 'accidentspots' ? true : true;

            let div = document.createElement("div");
            div.classList.add("d-flex");

            div.append(input);
            div.innerHTML += "<label for='"+ layerName.toLowerCase() +"' class='ml-1 mb-0'>"+ layerName +"</label>";

            this._container.append(div);
        });

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

map.addControl(new LayerControl(), 'top-right');

let overLayers = document.querySelectorAll(".layer");
overLayers.forEach(overlay => {
    overlay.addEventListener("click", function(e) {
        toggleLayer(e);
    });
});

function toggleLayer(e) {
    console.log(e);
    let value = e.target.value;
    let isChecked = e.target.checked ? true : false;

    // turn the layer on or off
    if(isChecked) {
        map.setLayoutProperty(value, 'visibility', 'visible');
    } else {
        map.setLayoutProperty(value, 'visibility', 'none');
    }
}


// PAGINATION
// HEATMAP
// ALERT TYPES
// ALERT STATUS
// SCROLL: STATIC MAP
function connectToChatWebSocket(alert_id, submitButton, inputMessage, myModal, declined) {
    var url = 'ws://' + window.location.host + '/ws/chat/room/' + alert_id + '/';
    console.log(url);
    var chatSocket = new WebSocket(url);

    chatSocket.onmessage = function(e) {
        let data = JSON.parse(e.data);
        console.log(data);
    }

    chatSocket.onclose = function(e) {
        console.log("Chat closed unexpectedly");
    }

    submitButton.on("click", function(e) {
        console.log("Sending text message")
        // get the message
        let message = inputMessage.val();
        console.log(message);

        if(!message) return;

        // send the message
        if(declined) {
            chatSocket.send(JSON.stringify({'message':message, 'declined':true}))
        } else {
            chatSocket.send(JSON.stringify({'message':message}))
        }

        // reset the form input
        inputMessage.val("");
        inputMessage.focus();

        inputMessage.keyup(function(e) {
            if (e.which === 13) {
                // submit with enter / return key
                submitButton.click();
            }
        });

        // close the modal 
        myModal.modal('toggle');

        // close webskocket
        chatSocket.close(4000, "Message Sent");

    });

}

// recieve alerts on creation
let url = 'ws://' + window.location.host + '/ws/chat/alerts/group_alerts';
const alertWebSocket = new WebSocket(url);

alertWebSocket.onopen = function(e) {
    console.log("Socket open");
}


alertWebSocket.onmessage = function(e) {
    console.log(e);
    let data = JSON.parse(e.data); 
    console.log(data);  

    let alert = JSON.parse(data.message);
    console.log(alert.features[0]);

    // update cardList update alerts
    allAlerts.push(alert.features[0]);
    renderMarker(alert.features[0]);

    // update list
    let newAlert = alert.features[0];
    newAlert.properties.alert_image = [];

    let element = renderAlertListing(newAlert);
    $('#alerts-section').prepend(element);
}


alertWebSocket.onclose = function() {
    console.log("chat closed unexpectedly");
}

// implement data pulling
refreshAlerts.addEventListener("click", function(e) {
    // updateAlerts();
    // fetchAlerts()

    // create feeds
    
});