const scroller = scrollama();
// token is restricted to the https://mikelmaron.github.io/hhnbo-mbx-2019/ url.
// Replace with your own token.
const accessToken = 'pk.eyJ1IjoibWlrZWxtYXJvbiIsImEiOiJjaWZlY25lZGQ2cTJjc2trbmdiZDdjYjllIn0.Wx1n0X7aeCQyDTnK6_mrGw';

// Map style - update if you create your own. This one is public and should work with your token
const mapStyle = 'mapbox://styles/mikelmaron/cjzb191xd007s1cn1vmfg7xcn';

// If you upload the data into a new style, you will have to update the name of the layers. Make sure they match the id of your layers in Studio (or here if you use addLayer()). You will also have to re-style the data. Check the data folder for the json files for each layer. It contains the expressions used to the properties. You can copy and paste  it into Studio by clicking on "</>" or use it in Mapbox GL JS.
const uavLayer = 'kibera-road-clearance-uav';
const schoolLayer = 'kibera-schools';

// access token
mapboxgl.accessToken = accessToken;

// map config
const map = new mapboxgl.Map({
  container: 'map',
  style: mapStyle,
  center: [36.78757, -1.31179],
  zoom: 14
});

// function to reset map to original position
const mapReset = () => {
  map.easeTo({
    center: [36.78757, -1.31179],
    zoom: 14,
    pitch: 0,
    bearing: 0
  });
  map.setLayoutProperty(uavLayer, 'visibility', 'none');
  map.setLayoutProperty(schoolLayer, 'visibility', 'none');
  map.setPaintProperty(schoolLayer, 'circle-color', '#6babf5');
};

// wait for map to finish load before adding interactions
map.on('load', () => {
  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // A map event -- on mouseenter
  map.on('mouseenter', schoolLayer, (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    const description = "<b>" + e.features[0].properties.name + "</b><br/>"
      + (e.features[0].properties['education:students'] ? e.features[0].properties['education:students'] + " students" : "");

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(e.lngLat)
      .setHTML(description)
      .addTo(map);
  });

  map.on('mouseleave', schoolLayer, () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

  // list of layer ids - used to create our buttons and toggle visiblity
  const toggleableLayerIds = [uavLayer, schoolLayer];

  toggleableLayerIds.forEach((toggleableLayerId) => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = toggleableLayerId;
    link.id = toggleableLayerId;
    link.className = map.getLayoutProperty(toggleableLayerId, 'visibility') === 'visible' ? 'active': '';

    link.onclick = function(e) {
      const clickedLayer = this.textContent;
      const visibility = map.getLayoutProperty(clickedLayer, 'visibility');
      e.preventDefault();
      e.stopPropagation();

      if (visibility === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
      } else {
        this.className = 'active';
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      }
    };

    const layers = document.getElementById('menu');
    layers.appendChild(link);
  });

  // scrollama object
  scroller
    .setup({
      step: '.step'
    })
    // decide what to do when our step enters the viewport
    .onStepEnter(response => {
      const currentStep = response.element.dataset.step;
      const currentDirection = response.direction;
      const directionIs = (step, direction) => {
        return currentStep === step && currentDirection === direction;
      };

      if (directionIs('b', 'down') || directionIs('b', 'up')) {
        map.setLayoutProperty(uavLayer, 'visibility', 'visible');
      } else if (directionIs('a', 'up')) {
        mapReset();
      } else if (directionIs('c', 'down') || directionIs('c', 'up')) {
        map.flyTo({
          center: [36.788824, -1.305677],
          zoom: 17,
          pitch: 60,
          bearing: 175.5,
          duration: 3000
        });
      } else if (directionIs('d', 'down') || directionIs('d', 'up')) {
        map.easeTo({
          center: [36.7907998, -1.3095271],
          zoom: 18.5,
          pitch: 60,
          bearing: -168.6,
          duration: 2000
        })
      } else if (directionIs('e', 'down') || directionIs('e', 'up')) {
        map.easeTo({
          center: [36.789473, -1.315647],
          zoom: 17.5,
          pitch: 60,
          bearing: -148.5,
          duration: 4000
        })
      } else if (directionIs('f', 'down') || directionIs('f', 'up')) {
        map.easeTo({
          center: [36.78757, -1.31179],
          zoom: 14,
          pitch: 0,
          bearing: 0,
          duration: 2000
        });

        map.setLayoutProperty(schoolLayer, 'visibility', 'visible');

      } else if (directionIs('g', 'down') || directionIs('g', 'up')) {
        map.easeTo({
          center: [36.791198, -1.309916],
          zoom: 15.5,
          pitch: 0,
          bearing: 0,
          duration: 2000
        });

        map.setPaintProperty(schoolLayer, 'circle-color',
          ['match',
            ['get','road-clearance'],
            'y', '#f56b6b',
            '#6babf5'
          ]
        );
      } else if (directionIs('h', 'down')) {
        mapReset();
        map.setLayoutProperty(uavLayer, 'visibility', 'visible');
        map.setLayoutProperty(schoolLayer, 'visibility', 'visible');
        toggleableLayerIds.forEach((toggleableLayerId) => {
          document.getElementById(toggleableLayerId).className = map.getLayoutProperty(toggleableLayerId, 'visibility') === 'visible' ? 'active': '';
        })
      }
    });
});

// setup resize event
window.addEventListener('resize', scroller.resize);
