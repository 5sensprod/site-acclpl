// import { initMap, handleAutocomplete,initializeAddressHandlers } from './leaflet-config.js';
// import { initMap, handleAutocomplete } from './leaflet-config.js';
import { handleAutocomplete } from './utils/addressSearch.js';
import { initMap } from './utils/mapConfig.js';

import { initializeAddressHandlers } from './utils/addressHandlers.js';
import { initializeCamera } from './utils/cameraHandlers.js';

const searchInput = document.getElementById('location-input');

initMap();
handleAutocomplete(searchInput);
initializeCamera();
initializeAddressHandlers();