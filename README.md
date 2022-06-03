# Gardalocation
A simple garda location application using esri development environment

# Instructions

To display garda information click on the black icons and an informational popup will appear with the relevent information.
The source code is available at [Github](https://github.com/jmshanahan/Gardalocation).

# Features
This web application has been designed to work on Desktop, Tablet and Phone.
If testing on desktop use the mouse to drag the browser to a smaller position and you will see the menu and contents change and relaign itself.


# Dataset
The dataset used to develop this application was downloaded from the [Geohive](https://www.geohive.ie/datasets/9058900a71864f7a87b6863dfebb7390_0/about)
There does appear to be some errors in the dataset, for example when you click on the Carrick-on-Suir garda station its Division is marked as Ennis. This is unlikely.


# Issues

## Nesting flexbox
I wanted to nest the MapView inside a flexbox container so I could another column to the right of it. But when I did initially he map would not display.

This would work
```
        <div>
            <div id="viewDiv"></div>
        </div>
```
But it needed the ```getElementById```
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
The only way this would work was to remove the surrounding ```div``` from the ```MapView```

The dom would look like this
```
    <div id="viewDiv"></div>
 ```
 A strange one this but it is working now.


## Unresolved Issue

I wanted to add a scale at the bottom of the mapView.
I added the usual require for scalebar and passed it in
The code is as follows
```
  view.ui.add(compassWidget, "top-left");
    const scaleBar = new ScaleBar({
      view: view,
      unit: "dual" ,
      visible: true
    });
    view.ui.add(scaleBar,{position: "bottom-left"});
  });
```

I then attempted to add the compassWidget and I had the same issue.
If you go to the main.js file on the scalebar branch you will see the code. There is nothing obvious that I could see. The conclusion that I reached is that it could possible have something to do with the flexbox display and that took a bit of adjusting to get working
