import L from 'leaflet';

export function createOpenStreetMapLayer() {
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
}

export async function createBingAerialLayer(apiKey) {
  await import('leaflet-bing-layer');
  return L.tileLayer.bing({
    bingMapsKey: apiKey,
    imagerySet: 'Aerial',
  });
}