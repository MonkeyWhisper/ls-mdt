var Dispatches = {};
// var MAP = null;
var MAP_LIST = {}

function CreateMAP(key, id) {
    CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
        projection: L.Projection.LonLat,
        scale: function(zoom) {
    
            return Math.pow(2, zoom);
        },
        zoom: function(sc) {
    
            return Math.log(sc) / 0.6931471805599453;
        },
        distance: function(pos1, pos2) {
            var x_difference = pos2.lng - pos1.lng;
            var y_difference = pos2.lat - pos1.lat;
            return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
        },
        transformation: new L.Transformation(0.02072, 117.3, -0.0205, 172.8),
        infinite: false
    });
    
    MAP_LIST[key] = L.map(id, {
        crs: CUSTOM_CRS,
        minZoom: 3,
        maxZoom: 7,
    
        noWrap: true,
        continuousWorld: false,
        preferCanvas: true,
    
        center: [0, -1024],
        zoom: 4,
    });

    var MAP = MAP_LIST[key]

    
    var MAP_IMAGE = 'https://gta-assets.nopixel.net/images/dispatch-map.png';
    var SW = MAP.unproject([0, 1024], 3 - 1);
    var NE = MAP.unproject([1024, 0], 3 - 1);
    var MAP_BOUNDS = new L.LatLngBounds(SW, NE);
    MAP.setMaxBounds(MAP_BOUNDS);

    MAP.attributionControl.setPrefix(false)

    L.imageOverlay(MAP_IMAGE, MAP_BOUNDS).addTo(MAP);

    MAP.on('drag', function() {
        MAP.panInsideBounds(MAP_BOUNDS, { animate: false });
    });
}

CreateMAP("small", "map-item2")
CreateMAP("big", "map-item")

function DispatchMAP(DISPATCH){
    var MIN =  Math.round(Math.round((new Date() - new Date(DISPATCH.time)) / 1000) / 60);
    // var MIN = 2;
    if (MIN > 10)
        return;

    $.each(MAP_LIST, function(key, value) {

        var COORDS_X = DISPATCH.origin.x
        var COORDS_Y = DISPATCH.origin.y
        var CODE = DISPATCH.callId

        var ICON_TYPE = DispatchPing

        Dispatches[CODE] = L.marker([COORDS_Y,COORDS_X], { icon: ICON_TYPE })

        Dispatches[CODE].bindTooltip(`<div class="map-tooltip-info">${DISPATCH.dispatchMessage}</div><div class="map-tooltip-resp"><b>${Object.keys(DISPATCH.units).length}</b> units responding.</div><div class="map-tooltip-id">#${DISPATCH.callId}</div>`,
            {
                direction: 'top',
                permanent: false,
                offset: [0, -10],
                opacity: 1,
                interactive: true,
                className: 'map-tooltip'
        });
        Dispatches[CODE].addTo(value);
    })
}

function ClearMap() {
    $(".leaflet-popup-pane").empty();
    $(".leaflet-marker-pane").empty();
}
var DispatchPing = L.divIcon({
    html: '<i class="fa fa-map-marker-alt fa-2x"></i>',
    iconSize: [20, 20],
    className: 'map-icon map-icon-ping',
    offset: [-10, 0]
});