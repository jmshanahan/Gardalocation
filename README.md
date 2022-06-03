# Gardalocation
A simple garda location application using esri development environment



# Unresolved Issues

## Nesting flex box
I wanted to nest the MapViwe inside a flexbox container so I could another column to the right of it. But when I did The map would not display.

This would work
```
        <div>
            <div id="viewDiv"></div>
        </div>
```
But it needed the ```getElementById````
```
    const viewNode = window.document.getElementById("viewDiv");
    
    
    const view = new MapView({
      container: viewNode, // Reference to the view div created in step 5
      map: map, // Reference to the map object created before the view
      zoom: 10, // Sets zoom level based on level of detail (LOD)
      center: [-7, 53] // Sets center point of view using longitude,latitude
    });

```
This would not work

```
    const view = new MapView({
      container: "viewDiv", // Reference to the view div created in step 5
      map: map, // Reference to the map object created before the view
      zoom: 10, // Sets zoom level based on level of detail (LOD)
      center: [-7, 53] // Sets center point of view using longitude,latitude
    });

```
The only way this would work was to remove the surrounding ```div``` from the ```MapView'```

The dom would look like this
```
    <div id="viewDiv"></div>
 ```