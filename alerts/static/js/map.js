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

let element = '<div class="card">'+
'<div class="card-body">'+
  '<h6 class="card-title text-success"> <i class="fa fa-plus mr-2"></i>Ambulance</h6>'+
 '<div class="info">'+
    '<p class="badge">Status New</p>'+
    '<p><i class="fa fa-info"></i>Kimathi Street</p>'+
    '<p><i class="fa fa-phone"></i>+254789794774</p>'+
    '<p><i class="fa fa-home"></i>Kimathi Street, Nyeri, Kenya</p>'+
    '<p><i class="fa fa-calendar"></i>2020-11-23 / 11:00:00</p>'+
 '</div>'+
  '<a href="#" class="btn btn-danger btn-sm mx-2 decline">Decline</a>'+
  '<a href="#" class="btn btn-success btn-sm mr-1 response">Respond</a>'+
'</div>'+
'</div>';

let popup = new mapboxgl.Popup()
    .setHTML(element);

let marker = new mapboxgl.Marker()
    .setLngLat([36.948670, -0.4227716770])
    .setPopup(popup)
    .addTo(map);


map.on('load', function(e) {
    // add map layers
    
});

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

        // toggle side-tab right
        $('#side-tab').removeClass('d-none');

        // update the side tab with emergency info
    });
});

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
    let alert = allAlerts.find(alert => alert.id == id);

    return alert;
}


function streamIncomingAlerts() {
    let marker = new mapboxgl.Marker({element})
        .setLngLat([36.748670, -0.4227716770])
        .setPopup(popup)
        .addTo(map);
}


$(viewAllRecords).on('click', function(e) {
    // toggle the text content

    // get the alerts
    requestAllAlerts();
});

function requestAllAlerts() {
    $.ajax({
        url:'/alert_list/',
        type:'GET',
        success:function(data) {
            console.log(data);

            // update the alerts sections
            $('#alerts-section').html(data);
        },
        error:function(error) {
            console.error(error);
        }
    })
}

// consume the rest API alerts