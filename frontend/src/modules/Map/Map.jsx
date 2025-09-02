import "./Map.scss"
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import russianBorder from '@constants/russian.json';
import { position, activeStations } from '@constants/constants';
import StationCard from "@modules/StationCard/StationCard";
import { customGreenMarkerIcon } from "@components/CustomMarker/CustomMarker";
import { getDataIGS } from "@services/dataService";


function Map() {
  const [stations, setStations] = useState ([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const dataIGS = async() => {
      const jsonIGS = await(getDataIGS());
      const filteredStations = activeStations.map(station => {
        const igsData = jsonIGS[station.Name.toUpperCase() + '00RUS'];
        if(igsData) {
          return {
            ...station,
            ...igsData
          };
        }
        return station;
      });
      setStations(filteredStations);
    }

    dataIGS();
  }, []);

  const stationsByCoords = stations.reduce((acc, station) => {
    const key = station.Latitude + ',' + station.Longitude;
    if (!acc[key]) acc[key] = [];
    acc[key].push(station);
    return acc;
  }, {});

  const handleClick = (station) => {
    if (selectedStation && selectedStation.Name === station.Name) {
      setSelectedStation(null);
    } else {
      setSelectedStation(station);
    }
  };

  return (
    <>
      <section className="cards">
          <div className="cards__container">
              <h2 className="cards__title">Карта сети актуальных станций ФИЦ ЕГС РАН</h2>
              <div className="cards__map-container">
                <div className="cards__map">
                  <MapContainer center={position} zoom={2} style={{height: '100%', width: '100%'}} attributionControl={false}>
                    <TileLayer
                      attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <GeoJSON data={russianBorder.features} className="cards__map--border" style={{ color: 'gray', weight: 1.25, fill: true }}/>
                    {Object.entries(stationsByCoords).map(([coordsStr, stationsGroup]) => {
                      const coords = coordsStr.split(',').map(Number);
                      return (
                        <Marker key={coordsStr} position={coords} icon={customGreenMarkerIcon}>
                          <Popup className="cards__map-popup">
                            {stationsGroup.map(station => (
                              <div key={station.Name}>
                                <h3 className="cards__map-popup__title"><strong>{station.Name.toUpperCase()}</strong></h3>
                                <p className="cards__map-popup__description"><strong>Местоположение</strong>: {station.Region}</p>
                                <p className="cards__map-popup__description"><strong>Координаты (Latitude, Longitude):</strong> {station.Latitude + ', ' + station.Longitude}</p>
                                {station.Receiver && <p className="cards__map-popup__description"><strong>Приемник (Receiver):</strong> {station.Receiver.Name}</p>}
                                {station.Antenna && <p className="cards__map-popup__description"><strong>Антенна (Antenna):</strong> {station.Antenna.Name}</p>}
                                {station.Receiver && <p className="cards__map-popup__description"><strong>Спутниковая система (Satellite system):</strong> {station.Receiver.SatelliteSystem}</p>}
                              </div>
                            ))}
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
                <div className="cards__map-info">
                  <ul className="cards__map-info-list">
                    {stations.map(station => {
                      return (
                        <li 
                          className="cards__map-info-item" 
                          key={station.Name} 
                          onClick={() => handleClick(station)}
                        >
                          <span className="cards__map-info-item-title">{station.Name.toUpperCase()}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {selectedStation && <StationCard station={selectedStation} />}
              </div>
          </div>
      </section>
    </>
  )
}

export default Map
