
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

function Map({ selectedTrip, isSidebarOpen, setSidebarOpen, congestionShape, currentVehicle }) {
    useEffect(() => {
        console.log("SelectedBusID in Map: " + selectedTrip)
    }, [isSidebarOpen,selectedTrip]);

    return (
        <div className="map">

            <MapContainer center={[50.1109, 8.6821]} zoom={13} style={{ height: "100vh", width: "100vw" }} zoomControl={false}>
                <button
                    className="sidebar-toggle"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}>
                    {!isSidebarOpen && (
                        <div className="w-24 h-24">
                            <img src="/icon/bus-station.png" alt="Filter bus line" />
                        </div>
                    )}
                </button>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                // Drawing stopes and shapes

                {selectedTrip && (
                    <Polyline
                        positions={selectedTrip.shapes.map(shape => [shape.shape_pt_lat, shape.shape_pt_lon])}
                        color="blue"
                    />
                )}

                {selectedTrip && selectedTrip.stop_times.map((stop, index) => (
                    <Marker key={index} position={[stop.location.latitude, stop.location.longitude]}>
                        <Popup>{stop.stop_name} (Ankunft: {stop.arrival_time}, Abfahrt: {stop.departure_time})</Popup>
                    </Marker>
                ))}


                // Drawing vehicle position
                {currentVehicle && (
                    <Marker position={[currentVehicle.current_position.latitude, currentVehicle.current_position.longitude]}>
                        <Popup>Fahrzeug Position</Popup>
                    </Marker>
                )}

                {/* Verkehrsdaten zeichnen */}
                {congestionShape && (
                    <Polyline positions={congestionShape.map(shape => [shape.shape_pt_lat, shape.shape_pt_lon])} color={getCongestionColor(currentVehicle.congestion_level.level)} />
                )}

            </MapContainer>
            </div>

    );
}

function getCongestionColor(level) {
    switch (level) {
        case 0:
            return "green";
        case 1:
            return "orange";
        case 2:
            return "red";
        default:
            return "blue";
    }
}

export default Map;

