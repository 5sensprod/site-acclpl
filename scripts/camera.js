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

document.addEventListener('DOMContentLoaded', () => {
    const startCameraButton = document.getElementById('start-camera');
    const videoElement = document.getElementById('video');
    const captureButton = document.getElementById('capture');
    const keepButton = document.getElementById('keep');
    const retryButton = document.getElementById('retry');
    const canvasElement = document.getElementById('canvas');
    const photoInputElement = document.getElementById('photo-input');
    const imgElement = document.getElementById('photo');

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
        stopCamera(cameraStream);

        videoElement.style.display = 'none';
        captureButton.style.display = 'none';
        keepButton.style.display = 'inline';
        retryButton.style.display = 'inline';
        document.getElementById('photo').src = imgElement.src;
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
