import { initMap } from './leaflet-config.js';

(async () => {
  const apiKey = 'Am5nb5VrsWkaEWg0P5vbRSZGV4Znu_stTUec_L6VwJ4443NUWDTM3cj0QZWW8Kvh';
  await initMap(apiKey);
})();