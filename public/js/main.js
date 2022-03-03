var map = L.map('map-template').setView([21.16729076280168, -100.93106351719217], 15);

const tileURL = 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png';

const tile = L.tileLayer(tileURL);

// Socket Io
const socket = io.connect();

// Marker
const marker = L.marker([21.16729076280168, -100.93106351719217]); // kiev, ukraine
marker.bindPopup('UTNG');
map.addLayer(marker);

// Geolocation
map.locate({enableHighAccuracy: true})
map.on('locationfound', (e) => {
  const coords = [e.latlng.lat + 0.5, e.latlng.lng + 0.5];
  const newMarker = L.marker(coords);
  newMarker.bindPopup('Tu hubicacion');
  map.addLayer(newMarker);
  socket.emit('userCoordinates', e.latlng);
});

// socket new User connected
socket.on('newUserCoordinates', (coords) => {
  console.log(coords);
  const newUserMarker = L.marker([coords.lat, coords.lng]);
  newUserMarker.bindPopup('Nuevo usuario');
  map.addLayer(newUserMarker);
}); 

map.addLayer(tile);