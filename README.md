# Plataforma de Monitoreo de Operativos Policiales en Tiempo Real

Este proyecto es una aplicación web que simula la detección y monitoreo de operativos policiales cercanos al usuario, utilizando geolocalización y notificaciones en tiempo real.

---

## Características

- Visualización en mapa de la ubicación del usuario y operativos policiales activos.
- Agregado automático de operativos cada 30 segundos para simular detección por IA.
- Notificaciones del navegador cuando se detecta un nuevo operativo.
- Posibilidad de cerrar operativos para limpiar el mapa.
- Panel lateral con listado de operativos activos y botón para centrarse en la ubicación del usuario.
- Guardado de operativos en `localStorage` para mantener el estado entre sesiones.

---

## Tecnologías

- React
- React Leaflet (mapas interactivos)
- Leaflet (librería de mapas)
- React Icons
- Tailwind CSS (estilos)
- API de geocodificación inversa de OpenStreetMap (Nominatim)

---

## Instalación y ejecución

1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
