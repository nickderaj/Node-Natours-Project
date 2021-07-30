// called data-locations in PUG, so it is called dataset.locations in JS
const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibmQxMzAzMSIsImEiOiJja3JwbjA1bGowMDZnMnBvMHdmcjJkNTN2In0.KJUjocwoqdB8DU2Z8c_aaA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/nd13031/ckrpo3fq26u9817qrufcf9bgw',
  scrollZoom: false,
  // center: [-118.13276, 34.127341],
  // zoom: 12,
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom', // bottom of the gps pin
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 100,
    left: 0,
    right: 0,
  },
});
