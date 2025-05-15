import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const position = [-34.5886, -60.9511]; // Coordenadas de Junín, Argentina

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      {/* Establece las capas del mapa */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Puedes agregar un marcador en Junín */}
      <Marker position={position} icon={new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' })}>
        <Popup>¡Estás en Junín!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
