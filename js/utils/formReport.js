import { searchAddress } from './addressSearch.js';
import { uploadImage } from './upload.js';

const reportForm = document.getElementById('report-form');
const locationInput = document.getElementById('location-input');
const nameInput = document.getElementById('name-input');
const photoInput = document.getElementById('photo-input');

async function getCoordinates(street, postalCode, city) {
    const fullAddress = `${street}, ${postalCode} ${city}`;
    const results = await searchAddress(fullAddress);

    if (results.length > 0) {
        const coords = results[0].geometry.coordinates;
        return {
            latitude: coords[1],
            longitude: coords[0]
        };
    } else {
        return { latitude: '', longitude: '' };
    }
}

reportForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const street = locationInput.dataset.street || '';
    const postalCode = locationInput.dataset.postalCode || '';
    const city = locationInput.dataset.city || '';
    const name = nameInput.value.trim();

    const coordinates = await getCoordinates(street, postalCode, city);
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    const formData = new FormData();
    formData.append('street', street);
    formData.append('postalCode', postalCode);
    formData.append('city', city);
    formData.append('name', name);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);


    try {
        const uploadResponse = await uploadImage(photoInput.value);
        const filename = uploadResponse.message;
        formData.append('photo', filename);
        console.log("Nom du fichier uploadé :", filename);

    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
        return;
    }

    //   const photoInput = document.getElementById('photo-input');

    formData.append('photo', photoInput.value);

    console.log(Object.fromEntries(formData.entries()));

    // Envoyez le formulaire au serveur avec fetch() ou XMLHttpRequest()
});

const startCameraButton = document.getElementById('start-camera');
const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const keepButton = document.getElementById('keep');
const retryButton = document.getElementById('retry');
const photo = document.getElementById('photo');

// Code pour gérer la caméra et la prise de photos

