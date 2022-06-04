window.addEventListener('load',checkJSLoaded)

function checkJSLoaded() {

require(["esri/config", 
"esri/Map", 
"esri/views/MapView",
"esri/layers/FeatureLayer",
"esri/renderers/SimpleRenderer",
"esri/PopupTemplate",
"esri/popup/content/CustomContent",
], function (esriConfig, 
  Map, 
  MapView,
  FeatureLayer,
  PopupTemplate,
  CustomContent, 
  SimpleRenderer) {
    esriConfig.apiKey = "AAPK340d910693ae44d888a6eb2e2b3224fcx9GYb-Ur-SC4Ubg-kT1zoSv0Y2H5Jb6qQ367krBx-Olc42mFGCzl9LzNO2V_MLdV";
    const gardaRenderer = {
    "type": "simple",
    "symbol": {
      "type": "simple-marker",
      "size": 6,
      "color": "black",
      "outline": {
        width: 2,
        color: "white"
        }
      }
  }

  const trailheadsLabels = {
    symbol: {
      type: "text",
      color: "#FFFFFF",
      haloColor: "#5E8D74",
      haloSize: "2px",
      font: {
        size: "12px",
        family: "Noto Sans",
        style: "italic",
        weight: "normal"
      }
    },

    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.COUNTY"
    }
  };
  

  const popupGarda = {
    "title": "<p style='color:#1792d2;font-size: 20px;'> Station Details</p>",
    "content": "<p style='color:red;text-align:center;font-size: 20px;'>{STATION_NA}<br></p><p><b>Division:</b> {DIVISION_H}<br> <b>Address:</b> {ADDRESS}<br> <b>Phone:</b> {PHONE_NUMB}<br></p>"
  }
         
    const fl = new FeatureLayer({
    url: "https://services7.arcgis.com/wN3nddBpje6kLtAh/arcgis/rest/services/garda_stations__an_garda_siochana/FeatureServer/0",
    renderer: gardaRenderer,
    labelingInfo: [trailheadsLabels],
    outFields: ["STATION_NA","DIVISION_H","ADDRESS","PHONE_NUMB"],
    popupTemplate: popupGarda
    });
  

    const map = new Map({
      basemap: "arcgis-streets-relief",
      layers:[fl]
    });
    
    const viewNode = window.document.getElementById("viewDiv");
    
    
    const view = new MapView({
      container: viewNode, // Reference to the view div created in step 5
      map: map, // Reference to the map object created before the view
      zoom: 10, // Sets zoom level based on level of detail (LOD)
      center: [-7, 53] // Sets center point of view using longitude,latitude
    });
  });
}
