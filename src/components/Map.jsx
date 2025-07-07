import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import ReactDOMServer from "react-dom/server";
import { FaMapMarkerAlt, FaUserShield } from "react-icons/fa";


const createReactIcon = (icon, color, extraClass = "") =>
  L.divIcon({
    html: ReactDOMServer.renderToString(
      <div style={{ color, fontSize: "1.5rem" }} className={extraClass}>
        {icon}
      </div>
    ),
    className: "",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

const CenterMapButton = ({ center }) => {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView(center, 15)}
      className="fixed bottom-24 right-6 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all z-[1000]"
      aria-label="Centrar mapa en mi ubicación"
    >
      Mi Ubicación
    </button>
  );
};

const Map = ({ userPosition, operativos, addOperativo, handleCloseOperativo }) => {
  return (
    <>
      <div className="relative rounded-xl shadow-lg border overflow-hidden z-10 max-w-screen-lg mx-auto px-4">
        <MapContainer center={userPosition} zoom={14} style={{ height: "80vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={userPosition} icon={createReactIcon(<FaMapMarkerAlt />, "blue")}>
            <Popup>Estás acá</Popup>
          </Marker>

          {operativos.map((op) => (
            <Marker
              key={op.id}
              position={[op.lat, op.lng]}
              icon={createReactIcon(<FaUserShield />, "red", "pulsing-icon")}
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
      </div>

      <button
        onClick={addOperativo}
        className="fixed bottom-36 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all z-[1000]"
        aria-label="Simular operativo policial"
      >
        Simular Operativo
      </button>
    </>
  );
};

export default Map;
