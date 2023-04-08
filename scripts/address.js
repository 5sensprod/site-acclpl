import { centerMap, updateMarker } from './map.js';

const locationInput = document.getElementById('location-input');
export const addressResults = document.getElementById('address-results');

export function handleAddressClick(result) {
    const { coordinates } = result.geometry;
    document.getElementById('latitude-input').value = coordinates[1];
    document.getElementById('longitude-input').value = coordinates[0];
    document.getElementById('street-input').value = result.properties.street || '';
    document.getElementById('city-input').value = result.properties.city || '';
    document.getElementById('postal-code-input').value = result.properties.postcode || '';

    // Utilisez updateMarker pour centrer la carte et mettre à jour le marqueur
    updateMarker(coordinates[1], coordinates[0], result.properties.label); // Modifiez cette ligne

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

    // Ajoutez un écouteur d'événements pour l'icône de géolocalisation
    const geolocationIcon = document.getElementById("geolocation-icon");
    geolocationIcon.addEventListener("click", handleGeolocation);
});


// Ajoutez cette fonction pour gérer la géolocalisation
async function handleGeolocation() {
    try {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Centrer la carte sur la position de l'utilisateur
                centerMap(latitude, longitude);

                // Requête à l'API pour obtenir l'adresse
                const response = await fetch(
                    `https://api-adresse.data.gouv.fr/reverse/?lat=${latitude}&lon=${longitude}`
                );
                const data = await response.json();
                const result = data.features[0];

                // Mettre à jour les champs du formulaire
                handleAddressClick(result);
            },
            (error) => {
                console.error("Erreur lors de la géolocalisation :", error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("L'utilisateur a refusé l'accès à la géolocalisation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Les informations de localisation ne sont pas disponibles.");
                        break;
                    case error.TIMEOUT:
                        alert("La demande de localisation a expiré.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("Une erreur inconnue s'est produite.");
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    } catch (error) {
        console.error("Erreur lors de la géolocalisation :", error);
    }
}