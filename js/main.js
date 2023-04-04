import { initMap, handleAutocomplete } from './leaflet-config.js';

const searchInput = document.getElementById('search-input');

initMap();
handleAutocomplete(searchInput);