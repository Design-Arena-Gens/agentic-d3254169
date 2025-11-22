"use client";

import { Driver } from "@/lib/types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

const driverIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  popupAnchor: [0, -30]
});

interface Props {
  drivers: Driver[];
}

export default function OrderMap({ drivers }: Props) {
  const center = useMemo(() => {
    if (!drivers.length) {
      return { lat: 12.9716, lng: 77.5946 };
    }

    const { lat, lng } = drivers[0].location;
    return { lat, lng };
  }, [drivers]);

  const Map: any = MapContainer;
  const Layer: any = TileLayer;
  const Point: any = Marker;
  const Tip: any = Popup;

  return (
    <Map
      center={[center.lat, center.lng]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <Layer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {drivers.map((driver) => (
        <Point
          key={driver.id}
          position={[driver.location.lat, driver.location.lng]}
          icon={driverIcon}
        >
          <Tip>
            <div className="space-y-1 text-xs">
              <p className="font-semibold">{driver.name}</p>
              <p>{driver.vehicle}</p>
              <p>Orders: {driver.currentOrderIds.length}</p>
              <p>Status: {driver.status}</p>
            </div>
          </Tip>
        </Point>
      ))}
    </Map>
  );
}
