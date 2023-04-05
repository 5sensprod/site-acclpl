export async function getCameraReady(video, constraints = { video: { facingMode: 'environment' } }) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    return stream;
}

export function stopCamera(stream) {
    stream.getTracks().forEach((track) => {
        track.stop();
    });
}