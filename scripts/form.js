import { addMarkers, removeMarker } from './map.js';
import { dropdownContent } from './dropdown.js';
import { showSpinner, hideSpinner } from './utils/spinner.js';
import { addressResults } from './address.js';
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

function checkFormCompletion(locationInput, nameInput, photoInputElement, submitButton) {
    if (locationInput.value && nameInput.value && photoInputElement.value) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

function clearLocation(locationInput) {
    locationInput.value = '';
    addressResults.innerHTML = '';
    removeMarker();
}

function clearName(nameInput) {
    nameInput.value = '';
}

async function submitForm(event, reportForm, locationInput, nameInput, photoInputElement, submitButton) {
    event.preventDefault();

    const formData = new FormData(reportForm);
    formData.append('location', locationInput.value);
    formData.append('name', nameInput.value);

    const photoBlob = base64ToBlob(imgElement.src.replace(/^data:image\/\w+;base64,/, ''));
    formData.append('photo', photoBlob, 'photo.jpeg');

    showSpinner(reportForm);

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
            reportForm.reset();
            dropdownContent.classList.remove('dropdown-content-up');
            addMarkers();
            imgElement.style.display = 'none';
            startCameraButton.style.display = 'block';
            await addMarkers();

            photoInputElement.value = '';
            checkFormCompletion(locationInput, nameInput, photoInputElement, submitButton);

            setTimeout(() => {
                hideSpinner();
            }, 500);

        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('report-form');
    const locationInput = document.getElementById('location-input');
    const nameInput = document.getElementById('name-input');
    const photoInputElement = document.getElementById('photo-input');
    const submitButton = document.getElementById('submit-button');
    const clearLocationIcon = document.getElementById('clear-location-icon');
    const clearNameIcon = document.getElementById('clear-name-icon');

    submitButton.disabled = true;

    locationInput.addEventListener('input', () => checkFormCompletion(locationInput, nameInput, photoInputElement, submitButton));
    nameInput.addEventListener('input', () => checkFormCompletion(locationInput, nameInput, photoInputElement, submitButton));
    photoInputElement.addEventListener('change', () => checkFormCompletion(locationInput, nameInput, photoInputElement, submitButton));

    clearLocationIcon.addEventListener('click', () => clearLocation(locationInput));
    clearNameIcon.addEventListener('click', () => clearName(nameInput));
    reportForm.addEventListener('submit', (event) => submitForm(event, reportForm, locationInput, nameInput, photoInputElement, submitButton));
});