import { addMarkers } from './map.js';

import { imgElement, startCameraButton } from './camera.js';

function base64ToBlob(base64, mimeType = 'image/jpeg') {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
}

document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('report-form');

    reportForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêcher le comportement par défaut du navigateur

        const locationInput = document.getElementById('location-input');
        const nameInput = document.getElementById('name-input');
        const photoInputElement = document.getElementById('photo-input');

        const formData = new FormData(reportForm);
        formData.append('location', locationInput.value);
        formData.append('name', nameInput.value);

        // Convertir la chaîne de caractères en base64 en un objet Blob et l'ajouter à FormData
        const photoBlob = base64ToBlob(imgElement.src.replace(/^data:image\/\w+;base64,/, ''));
        formData.append('photo', photoBlob, 'photo.jpeg');

        try {
            const response = await fetch('report.php', {
                method: 'POST',
                body: formData
            });
            const text = await response.text();
            console.log('Response text:', text);

            try {
                const data = JSON.parse(text);
                console.log('Success:', data);
                reportForm.reset(); // Réinitialiser les champs du formulaire
                addMarkers()
                imgElement.style.display = 'none'; // Cacher l'image
                startCameraButton.style.display = 'block'; // Afficher le bouton "Lancer l'appareil photo"
                await addMarkers();

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});