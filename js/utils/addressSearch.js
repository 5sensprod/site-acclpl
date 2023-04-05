import { getMap, getMarker, setMarker } from './mapConfig.js';

export async function searchAddress(query) {
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

      if (getMarker()) {
        getMap().removeLayer(getMarker());
      }
      setMarker(L.marker(coords).addTo(getMap()));
      getMarker().bindTooltip(street, { permanent: true, direction: 'top' });

      getMap().setView(coords, 16);
      list.remove();
    });

    newList.appendChild(li);
  }
}