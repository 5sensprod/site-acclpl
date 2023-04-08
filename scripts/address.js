import { updateMarker } from './map.js';

const locationInput = document.getElementById('location-input');
const addressResults = document.getElementById('address-results');

export function handleAddressClick(result) {
    const { coordinates } = result.geometry;
    document.getElementById('latitude-input').value = coordinates[1];
    document.getElementById('longitude-input').value = coordinates[0];
    document.getElementById('street-input').value = result.properties.street || '';
    document.getElementById('city-input').value = result.properties.city || '';
    document.getElementById('postal-code-input').value = result.properties.postcode || '';

    // Utilisez updateMarker pour centrer la carte et mettre à jour le marqueur
    updateMarker(coordinates[1], coordinates[0], result.properties.street);

    // Mettre à jour la valeur de l'input et vider les résultats de recherche
    locationInput.value = result.properties.label;
    addressResults.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    locationInput.addEventListener('input', async (event) => {
        const query = event.target.value;

        if (query.length < 3) {
            addressResults.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&postcode=51000`);
            const data = await response.json();
            const { features } = data;

            addressResults.innerHTML = '';

            features.forEach((feature) => {
                const addressElement = document.createElement('div');
                addressElement.classList.add('address-result');
                addressElement.textContent = feature.properties.label;

                // Remplacez le gestionnaire d'événements actuel par handleAddressClick
                addressElement.addEventListener('click', () => handleAddressClick(feature));

                addressResults.appendChild(addressElement);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    });
});