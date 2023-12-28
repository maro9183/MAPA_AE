var map;
var puntosLayer;

// Resto del código...

// Resto del código...

// Resto del código...

// Resto del código...

// Resto del código...

function cargarDatos() {
    console.log('Iniciando carga de datos...');
    d3.csv('AE.CSV').then(function(data) {
        console.log('Datos cargados correctamente:', data);

        // Crear un LayerGroup para los puntos
        puntosLayer = L.layerGroup().addTo(map);

        // Filtrar datos problemáticos
        data = data.filter(function(d, index) {
            const lat = parseFloat(d.LAT);
            const long = parseFloat(d.LONG);

            // Reemplazar comas por nada en la superficie total solo si está definida
            if (d['SUPERFICIE TOTAL']) {
                d['SUPERFICIE TOTAL'] = parseFloat(d['SUPERFICIE TOTAL'].replace(',', ''));

                // Forzar conversión a número
                if (isNaN(d['SUPERFICIE TOTAL'])) {
                    console.error('Error en superficie Total en posición ' + index + ':', d);
                    return false; // No es válido, se filtra
                }
            }

            // Reemplazar comas por nada en la superficie AE solo si está definida
            if (d['SUPERFICIE AE']) {
                d['SUPERFICIE AE'] = parseFloat(d['SUPERFICIE AE'].replace(',', ''));

                // Forzar conversión a número
                if (isNaN(d['SUPERFICIE AE'])) {
                    console.error('Error en superficie AE en posición ' + index + ':', d);
                    // No es válido, pero seguimos con la superficie total
                    delete d['SUPERFICIE AE']; // Eliminamos el valor incorrecto
                }
            }

            const isValid = !isNaN(lat) && !isNaN(long) && (!isNaN(d['SUPERFICIE AE']) || !isNaN(d['SUPERFICIE TOTAL']));

            if (!isValid) {
                console.log('Dato filtrado en posición ' + index + ':', d);
                console.log('Detalle:', 'LAT:', lat, 'LONG:', long, 'Superficie AE:', d['SUPERFICIE AE'], 'Superficie Total:', d['SUPERFICIE TOTAL']);
            }

            return isValid;
        });

        // Iterar sobre los datos y agregar puntos al mapa
        data.forEach(function(d) {
            const lat = parseFloat(d.LAT);
            const long = parseFloat(d.LONG);

            const radio = calcularRadio(parseFloat(d['SUPERFICIE AE']) || parseFloat(d['SUPERFICIE TOTAL']), parseFloat(d['SUPERFICIE TOTAL']));
            const color = getColor(parseFloat(d['SUPERFICIE AE']) || parseFloat(d['SUPERFICIE TOTAL']));

            const marcador = L.circleMarker([lat, long], {
                radius: radio,
                color: color,
                fillOpacity: 0.7
            }).bindPopup(generarContenidoPopup(d));

            // Agregar el marcador al LayerGroup
            puntosLayer.addLayer(marcador);
        });
    }).catch(function(error) {
        console.error('Error al cargar datos:', error);
    });
}

// Resto del código...

// Resto del código...

// Resto del código...


// Resto del código...

// Resto del código...

function calcularRadio(superficieAE, superficieTotal) {
    // Convertir a números y manejar posibles datos no numéricos
    var ae = parseFloat(superficieAE) || 0;
    var total = parseFloat(superficieTotal) || 1;

    // Cálculo del radio (ajusta según tu lógica específica)
    return Math.sqrt(ae / total) * 10;
}

function getColor(superficieAE) {
    // Convertir a número y manejar posibles datos no numéricos
    var ae = parseFloat(superficieAE) || 0;

    // Asignar colores según la lógica deseada
    return ae > 100 ? 'blue' : ae > 50 ? 'yellow' : 'red';
}

function generarContenidoPopup(datos) {
    var contenidoPopup = `<b>${datos.NOMBRE}</b><br>`;
    contenidoPopup += `ID: ${datos.ID}<br>`;
    contenidoPopup += `Región: ${datos.REGION}<br>`;
    contenidoPopup += `Partido: ${datos.PARTIDO}<br>`;
    contenidoPopup += `Localidad: ${datos.LOCALIDAD}<br>`;
    contenidoPopup += `Nombre: ${datos.NOMBRE}<br>`;
    contenidoPopup += `Superficie Total: ${datos['SUPERFICIE TOTAL']}<br>`;
    contenidoPopup += `Domicilio: ${datos.DOMICILIO}<br>`;
    contenidoPopup += `Correo: <a href="mailto:${datos.CORREO}">${datos.CORREO}</a><br>`;
    contenidoPopup += `Teléfono: <a href="tel:${datos.TELEFONO}">${datos.TELEFONO}</a><br>`;

    return contenidoPopup;
}

// Resto del código...



// Inicializar el mapa Leaflet
map = L.map('map').setView([-34.6037, -58.3816], 10); // Coordenadas centradas en Buenos Aires, Argentina
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Cargar datos al iniciar la aplicación
cargarDatos();


