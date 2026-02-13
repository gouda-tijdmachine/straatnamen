// Global variables
let currentView = 'map';
let timer;
let afbeeldingenOffset = 0;
let bHeeftMeerAfbeeldingen = true;

const aantalAfbeeldingen = 32;
const timeout = 120 * 1000; // 120 seconds
//const baseAPI = "https://www.goudatijdmachine.nl/api-straatnamen";
const baseAPI = "https://api-straatnamen.goudatijdmachine.nl";

// Initialize map view
var straten = [];
var stratenAlt = [];
let stratenLayer;
let geoJSONurl = `${baseAPI}/straatnamen`;

// Input fields for autocomplete
let inputField;
let ulField;

const locateButton = document.getElementById('locate-button');

function onEachFeature(feature, layer, groupLayer) {
    straten[feature.properties.naam] = feature.properties.identifier;
    stratenAlt[feature.properties.identifier] = feature.properties.naam_alt;

    groupLayer.addLayer(layer);

    function handleClick() {
        window.location.hash = '#' + feature.properties.identifier;
    }
    layer.on('click', handleClick);

    const hitLayer = L.polyline(layer.getLatLngs(), {
        color: '#000',
        opacity: 0,
        weight: 20,
        interactive: true
    }).addTo(groupLayer);

    hitLayer.on('click', handleClick);
    hitLayer.bindTooltip(feature.properties.naam, {
        className: 'street-tooltip',
        direction: 'auto',
        sticky: true,
        offset: [0, -10]
    });
}

function changeAutoComplete({
    target
}) {
    let data = target.value;
    ulField.innerHTML = ``;
    if (data.length > 2) {
        let autoCompleteValues = autoComplete(data);
        autoCompleteValues.forEach(value => {
            addItem(value);
        });
    }
}

function getStreetsNearby(lat, lng, callback) {
    const aantalStraatnamen = 8;
    const urlAPI = `${baseAPI}/straatnamen?limit=${aantalStraatnamen}&lat=${lat}&lon=${lng}`;

    fetch(urlAPI, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            ulField.innerHTML = '';
            data.straten.forEach(street => {
                let alt = '';
                if (stratenAlt[street.identifier]) {
                    alt = '<span class="alt-names-info" style="color:white">ⓘ';
                    alt += '<span class="alt-names-popup">Ook wel ' + stratenAlt[street.identifier] + ' genoemd.</span></span>';
                }

                ulField.innerHTML = ulField.innerHTML + `<li id="${street.identifier}">${street.naam}${alt}</li>`;
            });
        })
        .catch(error => {
            console.error('Error fetching streets:', error);
        })
        .finally(() => {
            locateButton.classList.remove('locating');
        });
}

function autoComplete(inputValue) {
    return Object.keys(straten).filter(
        (value) => value.toLowerCase().includes(inputValue.toLowerCase())
    );
}

function addItem(value) {
    const identifier = straten[value];
    let alt = '';
    if (stratenAlt[identifier]) {
        alt = '<span class="alt-names-info" style="color:white">ⓘ';
        alt += '<span class="alt-names-popup">Ook wel ' + stratenAlt[identifier] + ' genoemd.</span></span>';
    }

    ulField.innerHTML = ulField.innerHTML + `<li id="${identifier}">${value}${alt}</li>`;
}

function selectItem({ target }) {
    inputField.value = ''; // target.textContent.replace(/ⓘ.*/u, "")
    ulField.innerHTML = '';
    window.location.hash = '#' + encodeURIComponent(target.id);
}

function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        window.location.hash = '';
    }, timeout);
}

let currentStreetIdentifier = null;
let isLoadingImages = false;

function fetchAfbeeldingen(straatidentifier) {
    if (isLoadingImages) return;
    if (!bHeeftMeerAfbeeldingen) return;

    isLoadingImages = true;
    const encodedId = encodeURIComponent(straatidentifier);
    const urlAfbeeldingen = `${baseAPI}/afbeeldingen/${encodedId}?limit=${aantalAfbeeldingen}&offset=${afbeeldingenOffset}`;

    const gallery = document.getElementById('fotos');
    const noResult = document.getElementById('noresult');

    fetch(urlAfbeeldingen, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.afbeeldingen && data.afbeeldingen.length > 0) {
                data.afbeeldingen.forEach(afbeelding => {
                    const container = document.createElement('div');
                    container.className = 'gallery-item';
                    container.style.cursor = 'pointer';

                    const img = document.createElement('img');
                    img.src = afbeelding.image;
                    img.title = afbeelding.titel;
                    img.loading = "lazy";

                    // Add click handler to open modal
                    container.addEventListener('click', () => {
                        openIIIFModal(afbeelding, afbeelding.vervaardiger, afbeelding.datering);
                    });

                    container.appendChild(img);
                    gallery.appendChild(container);
                });

                // Update offset by the number of images received
                afbeeldingenOffset += data.afbeeldingen.length;

                // Check if there are more images to load
                // If we got fewer images than requested, we've reached the end
                if (data.afbeeldingen.length < aantalAfbeeldingen) {
                    bHeeftMeerAfbeeldingen = false;
                }

                // Show gallery if it was hidden
                gallery.style.display = 'grid';
                noResult.style.display = 'none';
            } else {
                // No images returned - stop making further requests
                bHeeftMeerAfbeeldingen = false;

                if (afbeeldingenOffset === 0) {
                    // Only show no result if this is the first load
                    gallery.style.display = 'none';
                    noResult.style.display = 'block';
                }
            }

            document.querySelectorAll('.gallery img').forEach(img => {
                img.onerror = () => img.parentElement.style.display = 'none';
            });

            return data;
        })
        .catch(error => {
            if (afbeeldingenOffset === 0) {
                gallery.style.display = 'none';
                noResult.style.display = 'block';
            }
            console.error("Fetch error:", error);
        })
        .finally(() => {
            isLoadingImages = false;
        });
}

function fetchStraatnamen(straatidentifier) {
    // Store current street and reset pagination
    currentStreetIdentifier = straatidentifier;
    afbeeldingenOffset = 0;
    bHeeftMeerAfbeeldingen = true;

    const encodedId = encodeURIComponent(straatidentifier);
    const urlStraatnamen = `${baseAPI}/straatnamen/${encodedId}`;

    const gallery = document.getElementById('fotos');
    const nameElement = document.getElementById('naam');
    const noResult = document.getElementById('noresult');
    const genoemdNaarElement = document.getElementById('genoemd_naar');
    genoemdNaarElement.style.display = 'none';

    gallery.innerHTML = '';
    nameElement.innerHTML = '';
    genoemdNaarElement.innerHTML = '';
    noResult.style.display = 'none';

    fetch(urlStraatnamen, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //nameElement.innerText = data.naam;
            nameElement.innerHTML = `<a target="omeka" href="${decodeURIComponent(straatidentifier)}">${data.naam}</a>`;

            if (data.alt_names || data.type === 'verdwenen') {
                let popContent = '';
                if (data.type === 'verdwenen') {
                    popContent += 'Deze Goudse straat bestaat niet meer!';
                }
                if (data.alt_names) {
                    if (data.type === 'verdwenen') {
                        popContent += "<br>";
                    }
                    popContent += ' Alternatieve namen en/of andere schrijfwijzen: ' + data.alt_names.join(', ');
                }
                const infoIcon = document.createElement('span');
                infoIcon.className = 'alt-names-info';
                infoIcon.innerHTML = 'ⓘ';

                const popup = document.createElement('span');
                popup.className = 'alt-names-popup';
                popup.innerHTML = popContent;

                infoIcon.appendChild(popup);

                nameElement.appendChild(infoIcon);
            }
            if (data.genoemd_naar !== null) {
                genoemdNaarElement.style.display = 'inline';
                const fullText = data.genoemd_naar;
                const limit = 300;

                if (fullText) {
                    if (fullText.length > limit) {
                        const truncatedText = fullText.substring(0, limit) + "...";
                        genoemdNaarElement.innerHTML = `<span class="text-content">${truncatedText}</span><span class="caret">&#9660;</span>`;
                        const caret = genoemdNaarElement.querySelector('.caret');
                        caret.addEventListener('click', () => {
                            genoemdNaarElement.innerText = fullText;
                        });
                    } else {
                        genoemdNaarElement.innerText = fullText;
                    }
                }
            } else {
                genoemdNaarElement.style.display = 'none';
            }

            return data;
        })
        .catch(error => {
            console.error("Fetch error:", error);
            throw error;
        });

    // Fetch images
    fetchAfbeeldingen(straatidentifier);
}


// Scroll handler for infinite scroll
function handleScroll() {
    if (currentView !== 'detail' || !currentStreetIdentifier || isLoadingImages) {
        return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if scrolled to bottom (with 200px threshold)
    if (scrollTop + windowHeight >= documentHeight - 200) {
        fetchAfbeeldingen(currentStreetIdentifier);
    }
}

function showMapView() {
    document.getElementById('map-view').classList.remove('hidden');
    document.getElementById('detail-view').classList.add('hidden');
    document.body.className = 'index';
    currentView = 'map';

    // Reset detail view content
    document.getElementById('fotos').innerHTML = '';
    document.getElementById('noresult').style.display = 'none';
    document.getElementById('result').style.display = 'block';

    // Invalidate map size to ensure proper rendering
    if (typeof map !== 'undefined') {
        setTimeout(() => map.invalidateSize(), 100);
    }

    // Clear timer
    clearTimeout(timer);

    // Remove scroll listener for infinite scroll
    window.removeEventListener('scroll', handleScroll);
}

function showDetailView(streetId) {
    document.getElementById('map-view').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    document.body.className = 'info';
    currentView = 'detail';

    // Load street data
    fetchStraatnamen(streetId);

    // Add scroll listener for infinite scroll
    window.removeEventListener('scroll', handleScroll); // Remove any existing listener
    window.addEventListener('scroll', handleScroll);

    // Start inactivity timer
    resetTimer();
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetTimer, false);
    });
}

function parseHash() {
    const hash = window.location.hash.slice(1); // Remove #
    if (hash.startsWith('http')) {
        showDetailView(hash);
    } else {
        showMapView();
    }
}

function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        window.location.hash = '';
    }, timeout);
}

// IIIF Modal & OpenSeadragon Integration
let osdViewer = null;

function openIIIFModal(foto, maker, datering) {
    const modal = document.getElementById('iiif-modal');
    const viewerContainer = document.getElementById('openseadragon-viewer');
    const originBtn = document.getElementById('iiif-origin-btn');
    const vervaardiger = document.getElementById('vervaardiger');

    vervaardiger.innerText = '';
    if (maker) {
        vervaardiger.innerText = "Gemaakt door " + maker + (datering ? " in " + datering.substring(0, 4) : "");
    }
    // Show modal
    modal.classList.remove('hidden');

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Destroy existing viewer if present
    if (osdViewer) {
        osdViewer.destroy();
        osdViewer = null;
    }

    // Check if IIIF info.json URL exists
    if (foto.iiif_info_json) {
        osdViewer = OpenSeadragon({
            id: "openseadragon-viewer",
            prefixUrl: "https://www.goudatijdmachine.nl/velepanden/assets/openseadragon/images/",
            tileSources: foto.iiif_info_json,
            showNavigationControl: true,
            navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
            showRotationControl: false,
            showHomeControl: false,
            showFullPageControl: false,
            showZoomControl: true,
            animationTime: 0.5,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 2,
            minZoomLevel: 0.8,
            visibilityRatio: 1,
            zoomPerScroll: 1.2,
            timeout: 120000
        });

        osdViewer.addHandler('open-failed', function (event) {
            console.error('Failed to load IIIF image:', event);
            viewerContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 1.5em; text-align: center; padding: 2em;">Fout bij laden van afbeelding. Probeer de bronlink.</div>';
        });
    } else {
        // Fallback: Display thumbnail with message
        viewerContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2em;">
                <img src="${foto.image}" alt="${foto.titel}" style="max-width: 80%; max-height: 70%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
                <p style="color: var(--gtm-wit); margin-top: 2em; font-size: 1.2em; text-align: center;">IIIF-weergave niet beschikbaar voor deze afbeelding.</p>
            </div>
        `;
    }

    // Set origin button link
    originBtn.onclick = () => {
        window.open(foto.url, 'samh');
    };
}

function closeIIIFModal() {
    const modal = document.getElementById('iiif-modal');

    modal.classList.add('hidden');

    document.body.style.overflow = '';

    if (osdViewer) {
        osdViewer.destroy();
        osdViewer = null;
    }

    document.getElementById('openseadragon-viewer').innerHTML = '';
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // IIIF Modal handlers
    const closeBtn = document.getElementById('iiif-close-btn');
    const overlay = document.querySelector('.iiif-modal-overlay');

    closeBtn.addEventListener('click', closeIIIFModal);
    overlay.addEventListener('click', closeIIIFModal);

    // ESC key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('iiif-modal');
            if (!modal.classList.contains('hidden')) {
                closeIIIFModal();
            }
        }
    });

    // Handle hash changes (browser back/forward)
    window.addEventListener('hashchange', parseHash);

    // Handle back button clicks
    document.getElementById('back-button').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.hash = '';
    });
    document.getElementById('back-button-footer').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.hash = '';
    });

    // Handle locate button click
    locateButton.addEventListener('click', function () {
        if ('geolocation' in navigator) {
            // Add spinning class
            locateButton.classList.add('locating');

            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                console.log('Current location:', {
                    latitude: lat,
                    longitude: lng,
                    accuracy: position.coords.accuracy
                });

                // Center map on current location
                map.setView([lat, lng], 16);

                // Get nearby streets and remove spinning class when done
                getStreetsNearby(lat, lng);
            }, function (error) {
                console.error('Error getting location:', error.message);
                // Remove spinning class on error
                locateButton.classList.remove('locating');
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    });

    // Initialize street layer and load GeoJSON
    stratenLayer = L.layerGroup().addTo(map);

    const gtmBlauw = getComputedStyle(document.documentElement)
        .getPropertyValue('--gtm-blauw').trim();
    const gtmBruin = getComputedStyle(document.documentElement)
        .getPropertyValue('--gtm-bruin').trim();

    loadJSON(geoJSONurl, function (data) {
        L.geoJSON(data, {
            style: function (feature) {
                const isHeden = feature.properties && feature.properties.type === "heden";
                return {
                    weight: 4,
                    color: isHeden ? gtmBlauw : gtmBruin
                }
            },
            onEachFeature: function (n, o) {
                onEachFeature(n, o, stratenLayer)
            }
        })
    }, function (n) {
        console.error(n)
    });

    // Setup autocomplete
    inputField = document.getElementById('input');
    ulField = document.getElementById('suggestions');
    inputField.addEventListener('input', changeAutoComplete);
    ulField.addEventListener('click', selectItem);

    // Parse initial hash on page load
    parseHash();
});
