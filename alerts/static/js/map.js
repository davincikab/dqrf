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
    center: {lng: 36.94867070615442, lat: -0.4227716770165415},
    zoom: 14.4
});

map.on('load', function(e) {
    // add map layers
   fetchAlerts();

    // alerts heatmap

});

function fetchAlerts(){
    fetch("/api/v1/")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        allAlerts = data.features;

        // create the markers and the respective popup  
        renderMarkers(allAlerts);
        renderAlertListing(allAlerts);

        // query all the cards
        declineAlerts = document.querySelectorAll(".decline");
        respondAlerts = document.querySelectorAll('.response');
        alerts = document.querySelectorAll(".view");

        // register event listeners
        registerListeners();
    })
    .catch(error  => {
        console.error(data)
    })
}

function renderAlertListing(features) {
    let docFragment = document.createDocumentFragment();

    features.forEach(feature => {
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

            console.log(this.classList);
        });

        element.addEventListener('mouseout', function(e) {
            this.classList.remove('active');
        });

        docFragment.append(element);
    });

    $('#alerts-section').append(docFragment);
}

function renderMarkers(features) {
    features.forEach(feature => {
        let element = '<div class="card">'+ cardElement(feature) +
        '</div>';

        let popup = new mapboxgl.Popup()
            .setHTML(element);

        // custom marker element
        let divMarker = document.createElement('div');
        divMarker.classList.add('marker-element');
        divMarker.innerHTML = '<i class="fa fa-info"></i>'

        let status = feature.properties.status; 

        let marker = new mapboxgl.Marker({element:divMarker})
            .setLngLat(feature.geometry.coordinates)
            .setPopup(popup)
            .addTo(map);
    });

}

function cardElement(feature) {
    let time = new Date(feature.properties.time);

    return  '<div class="card-body">'+
    '<h6 class="card-title text-white"> <i class="fa fa-plus mr-2"></i>'+
    feature.properties.emergency_type +
    '</h6>'+
    '<div class="info">'+
        '<p class="badge">Status '+ feature.properties.status +'</p>'+
        '<p><i class="fa fa-map-marker"></i>' + feature.properties.location_name +'</p>'+
        '<p><i class="fa fa-phone"></i>+254789794774</p>'+
        '<p><i class="fa fa-home"></i>'+ feature.properties.location_name +', Nyeri, Kenya</p>'+
        '<p><i class="fa fa-calendar"></i>'+ time +'</p>'+
    '</div>'+
    '<button class="btn btn-danger btn-sm mx-2 decline" data-alert-id="'+ feature.properties.pk +'">Decline</button>'+
    '<button class="btn btn-success btn-sm mr-1 response" data-alert-id="'+ feature.properties.pk +'">Respond</button>'+
    '<button class="btn btn-dark btn-sm mr-1 view" data-alert-id="'+ feature.properties.pk +'">View</button>'+
    '</div>';
}

function registerListeners() {
    declineAlerts.forEach(declineAlert => {
        declineAlert.addEventListener('click', function(e){
            e.preventDefault();
                alertId = this.getAttribute("data-alert-id");
            // open decline modal
            $('#decline-modal').modal('toggle');
        });
    });

    respondAlerts.forEach(respondAlert => {
        respondAlert.addEventListener('click', function(e){
            e.preventDefault();
            alertId = this.getAttribute("data-alert-id");
            // open respond modal
            $('#response-modal').modal('toggle');
        });
    });

    alerts.forEach(viewAlert => {
        viewAlert.addEventListener('click', function() {
            // display alert information
            alertId = this.getAttribute("data-alert-id");
            let alert = getAlertById(alertId);

            // update the side tab with emergency info
            let innerHtml = updateSideTabContent(alert);
            $('#side-tab').html(innerHtml);

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

        renderAlertListing(allAlerts);
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


// PAGINATION
// HEATMAP
// ALERT TYPES
// ALERT STATUS
// SCROLL: STATIC MAP