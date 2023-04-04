let marker;
let map;
// Fonction pour initialiser la carte Leaflet

export function initMap() {
  map = L.map('map', {
    center: [48.956682, 4.364298], // Coordonnées de Châlons-en-Champagne
    zoom: 16,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  marker = L.marker([48.956682, 4.364298]).addTo(map);
  marker.bindPopup('<b>Châlons-en-Champagne</b>').openPopup();
}

async function searchAddress(query) {
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&postcode=51000`);
  const data = await response.json();
  return data.features;
}

export async function handleAutocomplete(input) {
  input.addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length > 2) {
      const results = await searchAddress(query);
      updateAutocompleteList(input, results);
    } else {
      updateAutocompleteList(input, []);
    }
  });
}

function updateAutocompleteList(input, results) {
  const list = document.getElementById('autocomplete-list');
  if (list) {
    list.remove();
  }

  const newList = document.createElement('ul');
  newList.id = 'autocomplete-list';
  input.parentNode.appendChild(newList);

  for (const result of results) {
    const li = document.createElement('li');
    li.textContent = result.properties.label;
    li.addEventListener('click', () => {
      input.value = result.properties.label;
      input.blur();
      const coords = [result.geometry.coordinates[1], result.geometry.coordinates[0]];

      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(coords).addTo(map);
      marker.bindTooltip(result.properties.label, { permanent: true, direction: 'top' });

      map.setView(coords, 16);
      list.remove();
    });
    newList.appendChild(li);
  }
}