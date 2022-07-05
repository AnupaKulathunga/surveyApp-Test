// All Global Variables

var draw;
var flagIsDrawingOn = false;
var PointType = ["ATM", "Tree", "Telephone Poles", "Electricity Poles"];
var LineType = [
  "National Highway",
  "State Highway",
  "River",
  "Telephone Lines",
];
var PolygonType = [
  "Water Body",
  "Commercial Land",
  "Residentiol Land",
  "Building",
];

var selectedGeomType;

/**
 * Define a namespace for the application.
 */
window.app = {};
var app = window.app;

//
// Define Draw Tools.
//

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.DrawingApp = function (opt_options) {
  var options = opt_options || {};

  var button = document.createElement("button");
  button.id = "drawbtn";
  button.innerHTML = '<i class="fas fa-pencil-ruler"></i>';

  var this_ = this;
  var startStopApp = function () {
    if (flagIsDrawingOn == false) {
      $("#startdrawModal").modal("show");
    } else {
      map.removeInteraction(draw);
      flagIsDrawingOn = false;
      document.getElementById("drawbtn").innerHTML =
        '<i class="fas fa-pencil-ruler"></i>';
      defineTypeofFeature();
      $("#enterInformationModal").modal("show");
    }
  };

  button.addEventListener("click", startStopApp, false);
  button.addEventListener("touchstart", startStopApp, false);

  var element = document.createElement("div");
  element.className = "draw-app ol-unselectable ol-control";
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target,
  });
};
ol.inherits(app.DrawingApp, ol.control.Control);

// Define view
var myview = new ol.View({
  center: [8993529.33903063, 747659.9014018901],
  zoom: 14,
});

// OSM Layer
var baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: "Survey Application on OSM",
  }),
});

// Draw vector layer
// 1. Define Source
var drawSource = new ol.source.Vector();
// 2. Define Layer
var drawLayer = new ol.layer.Vector({
  source: drawSource,
});

// Layer Array
var LayerArray = [baseLayer, drawLayer];

// Map
var map = new ol.Map({
  controls: ol.control
    .defaults({
      attributionOptions: {
        collapsible: false,
      },
    })
    .extend([new app.DrawingApp()]),
  target: "map",
  view: myview,
  layers: LayerArray,
});

// Function to start Drawing
function startDraw(geomType) {
  selectedGeomType = geomType;
  draw = new ol.interaction.Draw({
    type: geomType,
    source: drawSource,
  });
  $("#startdrawModal").modal("hide");
  map.addInteraction(draw);
  flagIsDrawingOn = true;
  document.getElementById("drawbtn").innerHTML =
    '<i class="fas fa-stop-circle"></i>';
}

// Function to add types based on feature
function defineTypeofFeature() {
  var dropdownoftype = document.getElementById("typeofFeatures");
  dropdownoftype.innerHTML = "";
  if (selectedGeomType == "Point") {
    for (i = 0; i < PointType.length; i++) {
      var op = document.createElement("option");
      op.value = PointType[i];
      op.innerHTML = PointType[i];
      dropdownoftype.appendChild(op);
    }
  } else if (selectedGeomType == "LineString") {
    for (i = 0; i < LineType.length; i++) {
      var op = document.createElement("option");
      op.value = LineType[i];
      op.innerHTML = LineType[i];
      dropdownoftype.appendChild(op);
    }
  } else {
    for (i = 0; i < PolygonType.length; i++) {
      var op = document.createElement("option");
      op.value = PolygonType[i];
      op.innerHTML = PolygonType[i];
      dropdownoftype.appendChild(op);
    }
  }
}

// Function to save information in db
function savetodb() {
  // Get array of all features
  var featureArray = drawSource.getFeatures();
  // Define geojson format
  var geoJSONformat = new ol.format.GeoJSON();
  // Use method to convert to geojson
  var featuresGeojson = geoJSONformat.writeFeaturesObject(featureArray);
  // Array of all geojson
  var geoJsonFeatureArray = featuresGeojson.features;
  for (i = 0; i < geoJsonFeatureArray.length; i++) {
    var type = document.getElementById("typeofFeatures").value;
    var name = document.getElementById("exampleInputtext1").value;
    var geom = JSON.stringify(geoJsonFeatureArray[i].geometry);
    if (type != "") {
      $.ajax({
        url: "save.php",
        type: "POST",
        data: {
          typeofgeom: type,
          nameofgeom: name,
          stringofgeom: geom,
        },
        success: function (dataResult) {
          var result = JSON.parse(dataResult);
          if (result.statusCode == 200) {
            console.log("data added successfully");
          } else {
            console.log("data not added successfully");
          }
        },
      });
    } else {
      alert("please select type");
    }
  }
  // Close the Modal
  $("#enterInformationModal").modal("hide");

  cleanDrawSource();
}

// Remove Feature function
function cleanDrawSource() {
  drawSource.clear();
}
