import { initMap, handleAutocomplete } from './leaflet-config.js';

const searchInput = document.getElementById('location-input');

initMap();
handleAutocomplete(searchInput);