
var styles = `
.leaflet-container{background:#fff}
.leaflet-top,.leaflet-bottom{width:unset}
.leaflet-popup-content{min-width:200px}
.leaflet-bar a,.leaflet-bar a:hover{display:block!important}
`;

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function loadJSON(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success) success(JSON.parse(xhr.responseText));
			} else {
				if (error) error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.setRequestHeader("Accept", "application/geo+json");
	xhr.send();
}

// Gemeente Gouda (https://gis.gouda.nl/) - CC-BY-SA

var MAP_PROXY = 'https://www.goudatijdmachine.nl/omeka/map-proxy/?url=';
var MAXZOOM = 24;

var gisgouda_blaeu_1649 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/CHRASTER/wms?', { layers: 'StadsplattegrondBlaeu1649', version: "1.1.1", format: "image/png", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_1977 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/RASTER/wms?', { layers: 'Lufo_1977_Binnenstad', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_1987 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/RASTER/wms?', { layers: 'Lufo_1987_Binnenstad', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2005 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2005', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2010 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2010', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2012 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2012', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2014 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2014', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2015 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2015', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2016 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2016', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2017 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2017', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2018 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2018', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2019 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2019', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2020 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2020', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_luchtfoto_2021 = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Luchtfoto/wms?', { layers: 'lufo_2021', version: "1.1.1", maxZoom: MAXZOOM, transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_rijksmonumenten = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Bouwen/wms?', { layers: 'Rijksmonumenten', version: "1.1.1", maxZoom: MAXZOOM, format: "image/png", transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });
var gisgouda_gemeentemonumenten = L.tileLayer.wms(MAP_PROXY + 'https://gis.gouda.nl/geoserver/Bouwen/wms?', { layers: 'WKPB_Gemeentelijke_monumenten', maxZoom: MAXZOOM, version: "1.1.1", format: "image/png", transparent: true, attribution: "<a href='https://gis.gouda.nl'>Gemeente Gouda</a>" });

// PDOK / Kadaster (https://app.pdok.nl/viewer/) - CC-BY
// https://www.pdok.nl/-/nieuw-lage-resolutie-luchtfoto-2024-nu-beschikbaar-bij-pdo

var pdok_luchtfoto_2021 = L.tileLayer.wms(' https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?', { layers: '2021_orthoHR', maxZoom: MAXZOOM, attribution: "<a href='https://www.pdok.nl/'>PDOK</a>" });
var pdok_luchtfoto_2022 = L.tileLayer.wms(' https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?', { layers: '2022_orthoHR', maxZoom: MAXZOOM, attribution: "<a href='https://www.pdok.nl/'>PDOK</a>" });
var pdok_luchtfoto_2023 = L.tileLayer.wms(' https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?', { layers: '2023_orthoHR', maxZoom: MAXZOOM, attribution: "<a href='https://www.pdok.nl/'>PDOK</a>" });
var pdok_luchtfoto_2024 = L.tileLayer.wms(' https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?', { layers: '2024_orthoHR', maxZoom: MAXZOOM, attribution: "<a href='https://www.pdok.nl/'>PDOK</a>" });


// HISGIS
var huc_knaw_hisgis = L.tileLayer('https://tileserver.huc.knaw.nl/{z}/{x}/{y}', { minZoom: 10, maxZoom: 21, attribution: 'KNAW/HUC' });

// Mapbox MonochromeLightBlue - mapbox://styles/goudatijdmachine/ckxeio7ei0yr414mxuznqj3hw
var boxlb = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={token}', {
	maxZoom: MAXZOOM,
	attribution: '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a>',
	id: 'goudatijdmachine/ckxeio7ei0yr414mxuznqj3hw',
	token: 'pk.eyJ1IjoiZ291ZGF0aWpkbWFjaGluZSIsImEiOiJja3Q2N2RmcnkwZnBlMm9wZXhldWs4ZXFoIn0.HuPaUE1cVcyRIxrfAXPkIg'
});

// Mapbox kleur - mapbox://styles/goudatijdmachine/cmjeyi1ep004d01sde7qh8cac
var boxkl = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={token}', {
	maxZoom: MAXZOOM,
	attribution: '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a>',
	id: 'goudatijdmachine/cmjeyi1ep004d01sde7qh8cac',
	token: 'pk.eyJ1IjoiZ291ZGF0aWpkbWFjaGluZSIsImEiOiJja3Q2N2RmcnkwZnBlMm9wZXhldWs4ZXFoIn0.HuPaUE1cVcyRIxrfAXPkIg'
});

var map_layers = [boxkl];

var zoom = zoom || 16;
var map = L.map('map', {
	zoomSnap: 0,
	attributionControl: false,
	fullscreenControl: true,
	center: [52.011, 4.71],
	zoom: zoom,
	maxZoom: 21,
	layers: map_layers
});


L.control.attribution({ prefix: '' }).addTo(map);

var baseMap = {
	"Hedendaags (gekleurd)": boxkl,
	"Hedendaags (blauw)": boxlb
};

var overlayMaps = {
	"Blaeu 1649": gisgouda_blaeu_1649,
	"Minuutplannen 1830": huc_knaw_hisgis,
	"Luchtfoto 1977": gisgouda_luchtfoto_1977,
	"Luchtfoto 1987": gisgouda_luchtfoto_1987,
	"Luchtfoto 2005": gisgouda_luchtfoto_2005,
	"Luchtfoto 2010": gisgouda_luchtfoto_2010,
	"Luchtfoto 2015": gisgouda_luchtfoto_2015,
	"Luchtfoto 2021": pdok_luchtfoto_2021,
	"Luchtfoto 2022": pdok_luchtfoto_2022,
	"Luchtfoto 2023": pdok_luchtfoto_2023,
	"Luchtfoto 2024": pdok_luchtfoto_2024
};

L.control.layers(baseMap, overlayMaps).addTo(map);
