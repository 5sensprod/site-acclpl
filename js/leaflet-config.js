import { createOpenStreetMapLayer, createBingAerialLayer } from './mapLayers.js';

export async function initMap(apiKey) {
  const map = L.map('map', {
    center: [48.956682, 4.364298],
    zoom: 13,
  });

  const osmLayer = createOpenStreetMapLayer();
  const bingAerialLayer = await createBingAerialLayer(apiKey);

  osmLayer.addTo(map);

  const baseLayers = {
    'OpenStreetMap': osmLayer,
    'Bing Aerial': bingAerialLayer,
  };

  L.control.layers(baseLayers).addTo(map);

  const marker = L.marker([48.956682, 4.364298]).addTo(map);
  marker.bindPopup('<b>Châlons-en-Champagne</b>').openPopup();
}