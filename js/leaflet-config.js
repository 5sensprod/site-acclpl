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

async function addMarkersFromJson() {
  const response = await fetch('js/adresses.json');
  const addresses = await response.json();

  for (const address of addresses) {
    const coords = [address.latitude, address.longitude];
    const fullAddress = `${address.street}, ${address.postalCode} ${address.city}`;

    const marker = L.marker(coords).addTo(map);
    marker.bindPopup(fullAddress);
  }
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

export function updateAutocompleteList(input, results) {
  const list = document.getElementById('autocomplete-list');
  if (list) {
    list.remove();
  }

  const newList = document.createElement('ul');
  newList.id = 'autocomplete-list';
  input.parentNode.appendChild(newList);

  for (const result of results) {
    const li = document.createElement('li');
    const fullAddress = result.properties.label;

    const regex = /(.*)\s(\d{5})\s(.*)$/;
    const addressMatches = fullAddress.match(regex);
    const street = addressMatches[1].trim();
    const postalCode = addressMatches[2].trim();
    const city = addressMatches[3].trim();

    li.textContent = street;

    li.addEventListener('click', () => {
      input.value = street;
      input.blur();
      const coords = [result.geometry.coordinates[1], result.geometry.coordinates[0]];
      console.log(coords);

      input.dataset.street = street;
      input.dataset.postalCode = postalCode;
      input.dataset.city = city;

      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(coords).addTo(map);
      marker.bindTooltip(street, { permanent: true, direction: 'top' });

      map.setView(coords, 16);
      list.remove();
    });

    newList.appendChild(li);
  }
}


const addAddressButton = document.getElementById('add-address-button');
addAddressButton.addEventListener('click', async () => {
  const addressInput = document.getElementById('location-input');
  const street = addressInput.dataset.street || '';
  const postalCode = addressInput.dataset.postalCode || '';
  const city = addressInput.dataset.city || '';

  const fullAddress = `${street}, ${postalCode} ${city}`;
  const results = await searchAddress(fullAddress);

  if (results.length > 0) {
    const coords = results[0].geometry.coordinates;
    const latitude = coords[1];
    const longitude = coords[0];

    const address = {
      street: street,
      city: city,
      postalCode: postalCode,
      latitude: latitude,
      longitude: longitude
    };

    const data = JSON.stringify(address);
    fetch('adresses.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      addMarkersFromJson();
    })
    .catch(error => {
      console.error(error);
    });
  }
});