async function getCameraReady(video, constraints = { video: { facingMode: 'environment' } }) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    return stream;
}

function stopCamera(stream) {
    stream.getTracks().forEach((track) => {
        track.stop();
    });
}

const imgElement = document.getElementById('photo');
const startCameraButton = document.getElementById('start-camera');

document.addEventListener('DOMContentLoaded', () => {

    const videoElement = document.getElementById('video');
    const captureButton = document.getElementById('capture');
    const keepButton = document.getElementById('keep');
    const retryButton = document.getElementById('retry');
    const canvasElement = document.getElementById('canvas');
    const photoInputElement = document.getElementById('photo-input');

    let cameraStream;

    startCameraButton.addEventListener('click', async () => {
        cameraStream = await getCameraReady(videoElement);
        videoElement.style.display = 'inline';
        captureButton.style.display = 'inline';
        startCameraButton.style.display = 'none';
        keepButton.style.display = 'none';
        retryButton.style.display = 'none';
        document.getElementById('location-input').style.display = 'none';
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('submit-button').style.display = 'none';
        keepButton.style.display = 'inline';
        retryButton.style.display = 'none';
    });

    captureButton.addEventListener('click', () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        const ctx = canvasElement.getContext('2d');
        ctx.drawImage(videoElement, 0, 0);
        imgElement.src = canvasElement.toDataURL('image/jpeg');
        photoInputElement.value = imgElement.src.replace(/^data\:image\/\w+\;base64\,/, '');
        photoInputElement.dispatchEvent(new Event('change'));
        stopCamera(cameraStream);
    
        videoElement.style.display = 'none';
        captureButton.style.display = 'none';
        keepButton.style.display = 'inline';
        retryButton.style.display = 'inline';
        document.getElementById('photo').src = imgElement.src;
        
        imgElement.style.display = 'inline-block'; // Ajoutez cette ligne pour afficher l'image capturée
    });

    retryButton.addEventListener('click', async () => {
        cameraStream = await getCameraReady(videoElement);
        videoElement.style.display = 'inline';
        captureButton.style.display = 'inline';
        keepButton.style.display = 'none';
        retryButton.style.display = 'none';
    });

    keepButton.addEventListener('click', () => {
        stopCamera(cameraStream);
        videoElement.style.display = 'none';
        captureButton.style.display = 'none';
        keepButton.style.display = 'none';
        retryButton.style.display = 'none';
        startCameraButton.style.display = 'inline';
        document.getElementById('location-input').style.display = 'inline';
        document.getElementById('name-input').style.display = 'inline';
        document.getElementById('submit-button').style.display = 'inline';
    });
});
export { imgElement, startCameraButton };
