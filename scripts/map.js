// import { handleAddressClick } from './address.js';
import { deleteReport } from './report.js';

let map;
let marker;

async function addMarkers() {
    try {
        const response = await fetch('reports.json');
        const data = await response.json();

        // Parcourir les données et ajouter un marqueur pour chaque entrée
        for (let entry of data) {
            const marker = L.marker([entry.latitude, entry.longitude]).addTo(map);

            const popupContent = `
                <div class="popup-content">
                    <b>${entry.name}</b><br>
                    ${entry.street}<br>
                    ${entry.postal_code} ${entry.city}<br>
                    <img src="${entry.image}">
                    <button class="delete-button" data-id="${entry.id}">Supprimer</button>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('popupopen', () => {
                const deleteButtons = document.querySelectorAll('.delete-button');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const reportId = event.target.dataset.id;
                        const result = await deleteReport(reportId);
                        if (result.status === 'success') {
                            map.removeLayer(marker);
                        } else {
                            alert('Erreur lors de la suppression du rapport');
                        }
                    });
                });
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function initMap() {
    map = L.map('map', {
        center: [48.956682, 4.364298], // Coordonnées de Châlons-en-Champagne
        zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    marker = L.marker([48.956682, 4.364298]).addTo(map);
    marker.bindPopup('<b>Châlons-en-Champagne</b>').closePopup();
    // addMarkersFromJson();
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    addMarkers();
});

export function updateMarker(lat, lng) {
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }
}
