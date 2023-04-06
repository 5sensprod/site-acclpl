import { searchAddress } from './addressSearch.js';

export const addressChangeEvent = new CustomEvent('addressChange');

export function initializeAddressHandlers() {
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

      console.log(address);

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
          dispatchEvent(addressChangeEvent); // Déclenche l'événement personnalisé
        })
        .catch(error => {
          console.error(error);
        });
    }
  });
}

// export { addressChangeEvent };