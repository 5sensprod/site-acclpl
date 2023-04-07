// import { addMarkersFromJson } from '../leaflet-config.js';

let marker;
let map;
// Fonction pour initialiser la carte Leaflet

export function initMap() {
  map = L.map('map', {
    center: [48.956682, 4.364298], // Coordonnées de Châlons-en-Champagne
    zoom: 13,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  marker = L.marker([48.956682, 4.364298]).addTo(map);
  marker.bindPopup('<b>Châlons-en-Champagne</b>').openPopup();
  addMarkersFromJson()
}

export async function addMarkersFromJson() {
  const response = await fetch('js/adresses.json');
  const addresses = await response.json();

  for (const address of addresses) {
    const coords = [address.latitude, address.longitude];
    const fullAddress = `${address.street}, ${address.postalCode} ${address.city}`;

    const marker = L.marker(coords).addTo(getMap());
    marker.bindPopup(fullAddress);
  }
}




// export { marker, map };

export function getMap() {
  return map;
}

export function setMap(newMap) {
  map = newMap;
}

export function getMarker() {
  return marker;
}

export function setMarker(newMarker) {
  marker = newMarker;
}