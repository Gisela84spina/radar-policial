import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import { FaMapMarkerAlt, FaUserShield } from 'react-icons/fa';

// Crear íconos
const createReactIcon = (icon, color, extraClass = '') =>
  L.divIcon({
    html: ReactDOMServer.renderToString(
      <div style={{ color, fontSize: '1.5rem' }} className={extraClass}>
        {icon}
      </div>
    ),
    className: '',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

// Botón para centrar el mapa
const CenterMapButton = ({ center }) => {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView(center, 15)}
      className="fixed bottom-24 right-6 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all z-[1000]"
    >
      Mi Ubicación
    </button>
  );
};

// Función para obtener dirección a partir de coordenadas
async function getAddress(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    if (!response.ok) throw new Error('Error en la geocodificación inversa');
    const data = await response.json();
    const addr = data.address;

    const road =
      addr.road ||
      addr.residential ||
      addr.pedestrian ||
      addr.cycleway ||
      addr.footway ||
      addr.path;

    const houseNumber = addr.house_number || '';
    const intersection = addr.crossroad || addr.neighbourhood || '';
    const city = addr.city || addr.town || addr.village || '';

    if (road && houseNumber) return `${road} ${houseNumber}, ${city}`;
    if (road && intersection) return `${road} y ${intersection}, ${city}`;
    if (road) return `${road}, ${city}`;

    return data.display_name || 'Ubicación desconocida';
  } catch (error) {
    console.error(error);
    return 'Ubicación desconocida';
  }
}

// Coordenadas aleatorias cerca del usuario
function getRandomNearbyCoords(base, radius = 0.01) {
  const offsetLat = (Math.random() - 0.5) * radius;
  const offsetLng = (Math.random() - 0.5) * radius;
  return [base[0] + offsetLat, base[1] + offsetLng];
}

const Home = () => {
  const [operativos, setOperativos] = useState([]);
  const [userPosition, setUserPosition] = useState([-34.5931, -60.9439]);

  useEffect(() => {
    // Cargar operativos guardados
    const stored = localStorage.getItem('operativos');
    if (stored) setOperativos(JSON.parse(stored));

    // Obtener posición usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn('Permiso de ubicación denegado o no disponible.', err);
        }
      );
    }

    // Solicitar permiso para notificaciones
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Guardar operativos en localStorage
    localStorage.setItem('operativos', JSON.stringify(operativos));
  }, [operativos]);

  // Función para agregar operativo (manual o IA)
  const addOperativo = async () => {
    const [lat, lng] = getRandomNearbyCoords(userPosition, 0.02);
    const direccion = await getAddress(lat, lng);

    const nuevoOperativo = {
      id: Date.now(),
      lat,
      lng,
      mensaje: "Operativo Policial Detectado (IA)",
      direccion,
    };

    setOperativos((prev) => [...prev, nuevoOperativo]);

    if (Notification.permission === 'granted') {
      new Notification('¡Nuevo Operativo Policial Detectado!', {
        body: direccion,
      });
    }
  };

  // -----------------------------------------------
  // Simulación IA:
  // Cada 30 segundos se detecta un operativo automáticamente cerca del usuario.
  // En un sistema real, esta detección podría provenir de:
  // - análisis de video con modelos de visión por computadora,
  // - procesamiento de datos en tiempo real desde cámaras o sensores,
  // - APIs que envían alertas con coordenadas precisas.
  //
  // El siguiente código simula esta detección agregando un marcador aleatorio
  // y mostrando una notificación.
  // -----------------------------------------------
  useEffect(() => {
    const intervalo = setInterval(() => {
      addOperativo();
    }, 30000);

    return () => clearInterval(intervalo); // Limpiar intervalo al desmontar
  }, [userPosition]);

  // Función para cerrar operativo
  const handleCloseOperativo = (id) => {
    setOperativos((prev) => prev.filter((op) => op.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Panel lateral */}
      <div className="md:w-1/4 w-full bg-gray-100 rounded-lg shadow-lg border p-4 h-[80vh] overflow-y-auto order-2 md:order-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Operativos Activos</h2>
        {operativos.length === 0 ? (
          <p className="text-gray-500">No hay operativos activos.</p>
        ) : (
          operativos.map((op) => (
            <div key={op.id} className="mb-4 p-2 bg-white rounded shadow">
              <p className="text-sm font-medium">{op.direccion}</p>
              <button
                onClick={() => handleCloseOperativo(op.id)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Finalizar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Mapa */}
      <div className="md:w-3/4 w-full relative rounded-lg shadow-lg border overflow-hidden flex-grow order-1 md:order-2">
        <MapContainer center={userPosition} zoom={14} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker
            position={userPosition}
            icon={createReactIcon(<FaMapMarkerAlt />, 'blue')}
          >
            <Popup>Estás acá</Popup>
          </Marker>

          {operativos.map((op) => (
            <Marker
              key={op.id}
              position={[op.lat, op.lng]}
              icon={createReactIcon(<FaUserShield />, 'red', 'pulsing-icon')}
            >
              <Popup>
                <div className="flex flex-col items-center gap-2">
                  <span>{op.mensaje}</span>
                  <span className="text-sm text-gray-500">{op.direccion}</span>
                  <button
                    onClick={() => handleCloseOperativo(op.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                  >
                    Finalizar
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          <CenterMapButton center={userPosition} />
        </MapContainer>

        <button
          onClick={addOperativo}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all z-[1000]"
        >
          Simular Operativo Manual
        </button>
      </div>
    </div>
  );
};

export default Home;
