// import L from 'leaflet';

// Fonction pour initialiser la carte Leaflet
export function initMap() {
  // Créez l'objet de la carte et liez-le à l'élément HTML avec l'ID 'map'
  const map = L.map('map', {
    center: [48.956682, 4.364298], // Coordonnées de Châlons-en-Champagne
    zoom: 13,
  });

  // Ajoutez un fond de carte OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Ajoutez un marqueur sur la carte
  const marker = L.marker([48.956682, 4.364298]).addTo(map);
  marker.bindPopup('<b>Châlons-en-Champagne</b>').openPopup();
}