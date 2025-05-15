import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import { FaMapMarkerAlt, FaUserShield } from 'react-icons/fa';

// Crear íconos con React
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

  const handleClick = () => {
    map.setView(center, 15);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-6 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all z-[1000]"
    >
      Mi Ubicación
    </button>
  );
};

// Obtener dirección por coordenadas
async function getAddress(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    if (!response.ok) {
      throw new Error('Error en la geocodificación inversa');
    }
    const data = await response.json();
    const addr = data.address;

    const road =
      addr.road ||
      addr.pedestrian ||
      addr.cycleway ||
      addr.footway ||
      addr.path ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.village ||
      addr.town ||
      addr.city_district ||
      addr.city ||
      addr.county ||
      addr.state ||
      'Ubicación desconocida';

    const houseNumber = addr.house_number || '';

    return houseNumber ? `${road} ${houseNumber}` : road;
  } catch (error) {
    console.error(error);
    return 'Ubicación desconocida';
  }
}

// Simulación dentro de Junín urbana
function getRandomNearbyCoords(base, radius = 0.01) {
  const offsetLat = (Math.random() - 0.5) * radius;
  const offsetLng = (Math.random() - 0.5) * radius;
  return [base[0] + offsetLat, base[1] + offsetLng];
}

const Home = () => {
  const [operativos, setOperativos] = useState([]);
  const [userPosition, setUserPosition] = useState([-34.5931, -60.9439]); // Centro de Junín

  useEffect(() => {
    const stored = localStorage.getItem('operativos');
    if (stored) {
      setOperativos(JSON.parse(stored));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('operativos', JSON.stringify(operativos));
  }, [operativos]);

  const handleDetectOperativo = async () => {
    const [lat, lng] = getRandomNearbyCoords(userPosition, 0.02); // más cerca
    const direccion = await getAddress(lat, lng);
    const mensaje = "Operativo Policial Detectado";

    const nuevoOperativo = {
      id: Date.now(),
      lat,
      lng,
      mensaje,
      direccion,
    };

    setOperativos([...operativos, nuevoOperativo]);

    if (Notification.permission === 'granted') {
      new Notification('¡Nuevo Operativo Policial Detectado!', {
        body: direccion,
      });
    }
  };

  const handleCloseOperativo = (id) => {
    setOperativos((prev) => prev.filter((op) => op.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Mapa */}
      <div className="w-full md:w-3/4 relative rounded-lg shadow-lg border overflow-hidden">
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
          onClick={handleDetectOperativo}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all z-[1000]"
        >
          Simular Operativo
        </button>
      </div>

      {/* Barra lateral */}
      <div className="w-full md:w-1/4 bg-gray-100 rounded-lg shadow-lg border p-4 h-[80vh] overflow-y-auto">
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
    </div>
  );
};

export default Home;
