const video = document.getElementById('video');
const startCameraButton = document.getElementById('start-camera');
const captureButton = document.getElementById('capture');
const keepButton = document.getElementById('keep');
const retryButton = document.getElementById('retry');
const photo = document.getElementById('photo');
let stream;

async function getCameraReady() {
  const constraints = { video: { facingMode: 'environment' } };
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  video.style.display = 'block';
  captureButton.style.display = 'block';
}

function stopCamera() {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
  video.style.display = 'none';
  captureButton.style.display = 'none';
}

startCameraButton.addEventListener('click', () => {
  getCameraReady().catch((error) => {
    console.error('Erreur lors de la demande d\'accès à la caméra :', error);
  });
  startCameraButton.style.display = 'none';
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
  stopCamera();
});

keepButton.addEventListener('click', () => {
  // Vous pouvez ajouter des actions pour garder la photo
});

retryButton.addEventListener('click', () => {
  photo.src = '';
  getCameraReady().catch((error) => {
    console.error('Erreur lors de la demande d\'accès à la caméra :', error);
  });
  keepButton.style.display = 'none';
  retryButton.style.display = 'none';
});