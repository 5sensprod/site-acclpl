import { getCameraReady, stopCamera } from './camera.js';
// import { uploadImage } from './upload.js';

export function initializeCamera() {
    const video = document.getElementById('video');
    const startCameraButton = document.getElementById('start-camera');
    const captureButton = document.getElementById('capture');
    const keepButton = document.getElementById('keep');
    const retryButton = document.getElementById('retry');
    const photo = document.getElementById('photo');
    const photoInput = document.getElementById('photo-input');
    let stream;

    startCameraButton.addEventListener('click', async () => {
        try {
            stream = await getCameraReady(video);
            video.style.display = 'block';
            captureButton.style.display = 'block';
            startCameraButton.style.display = 'none';
        } catch (error) {
            console.error('Erreur lors de la demande d\'accès à la caméra :', error);
        }
    });

    captureButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        photo.src = canvas.toDataURL('image/png');
        keepButton.style.display = 'block';
        retryButton.style.display = 'block';
        stopCamera(stream);
        video.style.display = 'none';
        captureButton.style.display = 'none';
    });

    keepButton.addEventListener('click', () => {
        photoInput.value = photo.src; // Ajoutez cette ligne pour stocker l'image en base64 dans photoInput
    });

    retryButton.addEventListener('click', async () => {
        photo.src = '';
        try {
            stream = await getCameraReady(video);
            video.style.display = 'block';
            captureButton.style.display = 'block';
            keepButton.style.display = 'none';
            retryButton.style.display = 'none';
        } catch (error) {
            console.error('Erreur lors de la demande d\'accès à la caméra :', error);
        }
    });
}