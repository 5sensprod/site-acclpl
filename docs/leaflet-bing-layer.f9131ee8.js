// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/fetch-jsonp/build/fetch-jsonp.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.fetchJsonp = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null
  };

  function generateCallbackFunction() {
    return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
  }

  function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
      delete window[functionName];
    } catch (e) {
      window[functionName] = undefined;
    }
  }

  function removeScript(scriptId) {
    var script = document.getElementById(scriptId);
    if (script) {
      document.getElementsByTagName('head')[0].removeChild(script);
    }
  }

  function fetchJsonp(_url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // to avoid param reassign
    var url = _url;
    var timeout = options.timeout || defaultOptions.timeout;
    var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

    var timeoutId = undefined;

    return new Promise(function (resolve, reject) {
      var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
      var scriptId = jsonpCallback + '_' + callbackFunction;

      window[callbackFunction] = function (response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function json() {
            return Promise.resolve(response);
          }
        });

        if (timeoutId) clearTimeout(timeoutId);

        removeScript(scriptId);

        clearFunction(callbackFunction);
      };

      // Check if the user set their own params, and if not add a ? to start a list of params
      url += url.indexOf('?') === -1 ? '?' : '&';

      var jsonpScript = document.createElement('script');
      jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);
      if (options.charset) {
        jsonpScript.setAttribute('charset', options.charset);
      }
      if (options.nonce) {
        jsonpScript.setAttribute('nonce', options.nonce);
      }
      if (options.referrerPolicy) {
        jsonpScript.setAttribute('referrerPolicy', options.referrerPolicy);
      }
      jsonpScript.id = scriptId;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(function () {
        reject(new Error('JSONP request to ' + _url + ' timed out'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        window[callbackFunction] = function () {
          clearFunction(callbackFunction);
        };
      }, timeout);

      // Caught if got 404/500
      jsonpScript.onerror = function () {
        reject(new Error('JSONP request to ' + _url + ' failed'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    });
  }

  // export as global function
  /*
  let local;
  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }
  local.fetchJsonp = fetchJsonp;
  */

  module.exports = fetchJsonp;
});
},{}],"node_modules/bbox-intersect/index.js":[function(require,module,exports) {
module.exports = function(bbox1, bbox2){
  if(!(
      bbox1[0] > bbox2[2] ||
      bbox1[2] < bbox2[0] ||
      bbox1[3] < bbox2[1] ||
      bbox1[1] > bbox2[3]
    )){
      return true;
  } else {
    return false;
  }
}
},{}],"node_modules/leaflet-bing-layer/index.js":[function(require,module,exports) {
var L = require('leaflet')
var fetchJsonp = require('fetch-jsonp')
var bboxIntersect = require('bbox-intersect')

/**
 * Converts tile xyz coordinates to Quadkey
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Number} Quadkey
 */
function toQuadKey (x, y, z) {
  var index = ''
  for (var i = z; i > 0; i--) {
    var b = 0
    var mask = 1 << (i - 1)
    if ((x & mask) !== 0) b++
    if ((y & mask) !== 0) b += 2
    index += b.toString()
  }
  return index
}

/**
 * Converts Leaflet BBoxString to Bing BBox
 * @param {String} bboxString 'southwest_lng,southwest_lat,northeast_lng,northeast_lat'
 * @return {Array} [south_lat, west_lng, north_lat, east_lng]
 */
function toBingBBox (bboxString) {
  var bbox = bboxString.split(',')
  return [bbox[1], bbox[0], bbox[3], bbox[2]]
}

var VALID_IMAGERY_SETS = [
  'Aerial',
  'AerialWithLabels',
  'AerialWithLabelsOnDemand',
  'Road',
  'RoadOnDemand',
  'CanvasLight',
  'CanvasDark',
  'CanvasGray',
  'OrdnanceSurvey'
]

var DYNAMIC_IMAGERY_SETS = [
  'AerialWithLabelsOnDemand',
  'RoadOnDemand'
]

/**
 * Create a new Bing Maps layer.
 * @param {string|object} options Either a [Bing Maps Key](https://msdn.microsoft.com/en-us/library/ff428642.aspx) or an options object
 * @param {string} options.BingMapsKey A valid Bing Maps Key (required)
 * @param {string} [options.imagerySet=Aerial] Type of imagery, see https://msdn.microsoft.com/en-us/library/ff701716.aspx
 * @param {string} [options.culture='en-US'] Language for labels, see https://msdn.microsoft.com/en-us/library/hh441729.aspx
 * @return {L.TileLayer} A Leaflet TileLayer to add to your map
 *
 * Create a basic map
 * @example
 * var map = L.map('map').setView([51.505, -0.09], 13)
 * L.TileLayer.Bing(MyBingMapsKey).addTo(map)
 */
L.TileLayer.Bing = L.TileLayer.extend({
  options: {
    bingMapsKey: null, // Required
    imagerySet: 'Aerial',
    culture: 'en-US',
    minZoom: 1,
    minNativeZoom: 1,
    maxNativeZoom: 19
  },

  statics: {
    METADATA_URL: 'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/{imagerySet}?key={bingMapsKey}&include=ImageryProviders&uriScheme=https&c={culture}',
    POINT_METADATA_URL: 'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/{imagerySet}/{lat},{lng}?zl={z}&key={bingMapsKey}&uriScheme=https&c={culture}'
  },

  initialize: function (options) {
    if (typeof options === 'string') {
      options = { bingMapsKey: options }
    }
    if (options && options.BingMapsKey) {
      options.bingMapsKey = options.BingMapsKey
      console.warn('use options.bingMapsKey instead of options.BingMapsKey')
    }
    if (!options || !options.bingMapsKey) {
      throw new Error('Must supply options.BingMapsKey')
    }
    options = L.setOptions(this, options)
    if (VALID_IMAGERY_SETS.indexOf(options.imagerySet) < 0) {
      throw new Error("'" + options.imagerySet + "' is an invalid imagerySet, see https://github.com/digidem/leaflet-bing-layer#parameters")
    }
    if (options && options.style && DYNAMIC_IMAGERY_SETS.indexOf(options.imagerySet) < 0) {
      console.warn('Dynamic styles will only work with these imagerySet choices: ' + DYNAMIC_IMAGERY_SETS.join(', '))
    }

    var metaDataUrl = L.Util.template(L.TileLayer.Bing.METADATA_URL, {
      bingMapsKey: this.options.bingMapsKey,
      imagerySet: this.options.imagerySet,
      culture: this.options.culture
    })

    this._imageryProviders = []
    this._attributions = []

    // Keep a reference to the promise so we can use it later
    this._fetch = fetchJsonp(metaDataUrl, {jsonpCallback: 'jsonp'})
      .then(function (response) {
        return response.json()
      })
      .then(this._metaDataOnLoad.bind(this))
      .catch(console.error.bind(console))

    // for https://github.com/Leaflet/Leaflet/issues/137
    if (!L.Browser.android) {
      this.on('tileunload', this._onTileRemove)
    }
  },

  createTile: function (coords, done) {
    var tile = document.createElement('img')

    L.DomEvent.on(tile, 'load', L.bind(this._tileOnLoad, this, done, tile))
    L.DomEvent.on(tile, 'error', L.bind(this._tileOnError, this, done, tile))

    if (this.options.crossOrigin) {
      tile.crossOrigin = ''
    }

    /*
     Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
     http://www.w3.org/TR/WCAG20-TECHS/H67
    */
    tile.alt = ''

    // Don't create closure if we don't have to
    if (this._url) {
      tile.src = this.getTileUrl(coords)
    } else {
      this._fetch.then(function () {
        tile.src = this.getTileUrl(coords)
      }.bind(this)).catch(function (e) {
        console.error(e)
        done(e)
      })
    }

    return tile
  },

  getTileUrl: function (coords) {
    var quadkey = toQuadKey(coords.x, coords.y, coords.z)
    var url = L.Util.template(this._url, {
      quadkey: quadkey,
      subdomain: this._getSubdomain(coords),
      culture: this.options.culture
    })
    if (typeof this.options.style === 'string') {
      url += '&st=' + this.options.style
    }
    return url
  },

  // Update the attribution control every time the map is moved
  onAdd: function (map) {
    map.on('moveend', this._updateAttribution, this)
    L.TileLayer.prototype.onAdd.call(this, map)
    this._attributions.forEach(function (attribution) {
      map.attributionControl.addAttribution(attribution)
    })
  },

  // Clean up events and remove attributions from attribution control
  onRemove: function (map) {
    map.off('moveend', this._updateAttribution, this)
    this._attributions.forEach(function (attribution) {
      map.attributionControl.removeAttribution(attribution)
    })
    L.TileLayer.prototype.onRemove.call(this, map)
  },

  /**
   * Get the [Bing Imagery metadata](https://msdn.microsoft.com/en-us/library/ff701712.aspx)
   * for a specific [`LatLng`](http://leafletjs.com/reference.html#latlng)
   * and zoom level. If either `latlng` or `zoom` is omitted and the layer is attached
   * to a map, the map center and current map zoom are used.
   * @param {L.LatLng} latlng
   * @param {Number} zoom
   * @return {Promise} Resolves to the JSON metadata
   */
  getMetaData: function (latlng, zoom) {
    if (!this._map && (!latlng || !zoom)) {
      return Promise.reject(new Error('If layer is not attached to map, you must provide LatLng and zoom'))
    }
    latlng = latlng || this._map.getCenter()
    zoom = zoom || this._map.getZoom()
    var PointMetaDataUrl = L.Util.template(L.TileLayer.Bing.POINT_METADATA_URL, {
      bingMapsKey: this.options.bingMapsKey,
      imagerySet: this.options.imagerySet,
      z: zoom,
      lat: latlng.lat,
      lng: latlng.lng
    })
    return fetchJsonp(PointMetaDataUrl, {jsonpCallback: 'jsonp'})
      .then(function (response) {
        return response.json()
      })
      .catch(console.error.bind(console))
  },

  _metaDataOnLoad: function (metaData) {
    if (metaData.statusCode !== 200) {
      throw new Error('Bing Imagery Metadata error: \n' + JSON.stringify(metaData, null, '  '))
    }
    var resource = metaData.resourceSets[0].resources[0]
    this._url = resource.imageUrl
    this._imageryProviders = resource.imageryProviders || []
    this.options.subdomains = resource.imageUrlSubdomains
    this._updateAttribution()
    return Promise.resolve()
  },

  /**
   * Update the attribution control of the map with the provider attributions
   * within the current map bounds
   */
  _updateAttribution: function () {
    var map = this._map
    if (!map || !map.attributionControl) return
    var zoom = map.getZoom()
    var bbox = toBingBBox(map.getBounds().toBBoxString())
    this._fetch.then(function () {
      var newAttributions = this._getAttributions(bbox, zoom)
      var prevAttributions = this._attributions
      // Add any new provider attributions in the current area to the attribution control
      newAttributions.forEach(function (attr) {
        if (prevAttributions.indexOf(attr) > -1) return
        map.attributionControl.addAttribution(attr)
      })
      // Remove any attributions that are no longer in the current area from the attribution control
      prevAttributions.filter(function (attr) {
        if (newAttributions.indexOf(attr) > -1) return
        map.attributionControl.removeAttribution(attr)
      })
      this._attributions = newAttributions
    }.bind(this))
  },

  /**
   * Returns an array of attributions for given bbox and zoom
   * @private
   * @param {Array} bbox [west, south, east, north]
   * @param {Number} zoom
   * @return {Array} Array of attribution strings for each provider
   */
  _getAttributions: function (bbox, zoom) {
    return this._imageryProviders.reduce(function (attributions, provider) {
      for (var i = 0; i < provider.coverageAreas.length; i++) {
        if (bboxIntersect(bbox, provider.coverageAreas[i].bbox) &&
          zoom >= provider.coverageAreas[i].zoomMin &&
          zoom <= provider.coverageAreas[i].zoomMax) {
          attributions.push(provider.attribution)
          return attributions
        }
      }
      return attributions
    }, [])
  }
})

L.tileLayer.bing = function (options) {
  return new L.TileLayer.Bing(options)
}

module.exports = L.TileLayer.Bing

},{"leaflet":"node_modules/leaflet/dist/leaflet-src.js","fetch-jsonp":"node_modules/fetch-jsonp/build/fetch-jsonp.js","bbox-intersect":"node_modules/bbox-intersect/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56313" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/leaflet-bing-layer.f9131ee8.js.map