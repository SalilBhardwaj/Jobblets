/* LocationSelector.jsx – Modern UI Design */
"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const GEO_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
const STYLE = `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${GEO_KEY}`;

const autoURL = (q, lat, lon) =>
  `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    q
  )}&limit=6&lat=${lat}&lon=${lon}&format=json&apiKey=${GEO_KEY}`;

const revURL = (lat, lon) =>
  `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${GEO_KEY}`;

export default function LocationSelector({ value = null, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [opts, setOpts] = useState([]);
  const [mapBusy, setMapBusy] = useState(false);
  const [listBusy, setListBusy] = useState(false);

  const mapRef = useRef(null);
  const pinRef = useRef(null);

  /* ───────────────── helpers ───────────────── */
  const locate = () =>
    new Promise((res, rej) => {
      if (!navigator.geolocation) return rej();
      navigator.geolocation.getCurrentPosition((p) => res(p.coords), rej, {
        enableHighAccuracy: true,
        timeout: 8e3,
        maximumAge: 0,
      });
    });

  const pushAddress = async (lat, lon) => {
    const r = await fetch(revURL(lat, lon)).then((r) => r.json());
    if (!r.results?.[0]) return;
    const best = r.results[0];
    onChange({
      address: best.formatted,
      pincode: best.postcode,
      coordinates: { lat, lng: lon },
    });
    setStartLat(lat);
    setStartLng(lon);
  };

  /* ─────────── mount fresh map on every open ─────────── */
  const [startLat, setStartLat] = useState(28.6139);
  const [startLng, setStartLng] = useState(77.209);

  useEffect(() => {
    if (!open) return;

    setMapBusy(true);
    const start = { lat: startLat, lng: startLng };
    const map = new maplibregl.Map({
      container: "ls-map",
      style: STYLE,
      center: [start.lng, start.lat],
      zoom: 14,
    });
    mapRef.current = map;
    map.on("load", () => setMapBusy(false));

    const pin = new maplibregl.Marker({ draggable: true })
      .setLngLat([start.lng, start.lat])
      .addTo(map);
    pinRef.current = pin;

    pin.on("dragend", () => {
      const { lat, lng } = pin.getLngLat();
      pushAddress(lat, lng);
      setStartLat(lat);
      setStartLng(lng);
    });

    return () => {
      setOpts([]);
      setQuery("");
    };
  }, [open]);

  /* ─────────── debounced autocomplete ─────────── */
  useEffect(() => {
    if (query.length < 3) {
      setOpts([]);
      return;
    }

    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setListBusy(true);
      const p = pinRef.current?.getLngLat() || { lat: 28.6, lng: 77.2 };
      fetch(autoURL(query, p.lat, p.lng), { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setOpts(d.results || []))
        .catch(() => {})
        .finally(() => setListBusy(false));
    }, 350);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  /* ───────────────── Modern UI ───────────────── */
  return (
    <>
      <style>{`
        .location-selector-field {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .location-selector-field:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }
        
        .location-selector-field:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .location-selector-field:hover:before {
          opacity: 1;
        }
        
        .location-icon {
          width: 24px;
          height: 24px;
          margin-right: 12px;
          opacity: 0.9;
        }
        
        .location-text {
          flex: 1;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .location-arrow {
          margin-left: 12px;
          transition: transform 0.3s ease;
        }
        
        .location-selector-field:hover .location-arrow {
          transform: translateX(4px);
        }

        .location-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .location-modal-content {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .location-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 24px;
          color: white;
        }
        
        .location-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .location-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .location-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .search-container {
          position: relative;
          margin-bottom: 16px;
        }
        
        .search-input {
          width: 100%;
          padding: 16px 20px 16px 56px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .search-spinner {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .location-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .current-location-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          color: white;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .current-location-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }

        .suggestions {
          background: #f8fafc;
          max-height: 200px;
          overflow-y: auto;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .suggestion-item {
          padding: 16px 24px;
          cursor: pointer;
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .suggestion-item:hover {
          background: #e2e8f0;
          padding-left: 28px;
        }
        
        .suggestion-item:last-child {
          border-bottom: none;
        }
        
        .suggestion-icon {
          width: 16px;
          height: 16px;
          color: #64748b;
          flex-shrink: 0;
        }
        
        .suggestion-text {
          color: #334155;
          font-size: 15px;
          line-height: 1.4;
        }

        .map-container {
          height: 400px;
          position: relative;
          background: #f1f5f9;
        }
        
        .map-loading {
          position: absolute;
          inset: 0;
          background: rgba(248, 250, 252, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #64748b;
          font-weight: 500;
          z-index: 10;
        }
        
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .location-footer {
          padding: 24px;
          background: #f8fafc;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .footer-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .cancel-btn {
          background: #e2e8f0;
          color: #64748b;
        }
        
        .cancel-btn:hover {
          background: #cbd5e1;
          transform: translateY(-1px);
        }
        
        .save-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .save-btn:hover {
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          transform: translateY(-1px);
        }

        .map-credit {
          position: absolute;
          bottom: 8px;
          right: 12px;
          font-size: 10px;
          color: rgba(100, 116, 139, 0.7);
          background: rgba(248, 250, 252, 0.9);
          padding: 4px 8px;
          border-radius: 6px;
          backdrop-filter: blur(4px);
        }
        
        @media (max-width: 640px) {
          .location-modal {
            padding: 10px;
          }
          
          .location-modal-content {
            max-height: 95vh;
            border-radius: 20px;
          }
          
          .location-header {
            padding: 20px;
          }
          
          .location-title {
            font-size: 20px;
          }
          
          .map-container {
            height: 300px;
          }
          
          .location-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <button className="location-selector-field" onClick={() => setOpen(true)}>
        <svg className="location-icon" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="location-text">
          {value?.address || "Choose your location"}
        </span>
        <svg
          className="location-arrow"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>

      {open && (
        <div
          className="location-modal"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="location-modal-content">
            <div className="location-header">
              <div className="location-title">
                <span>📍 Select Location</span>
                <button
                  className="location-close"
                  onClick={() => setOpen(false)}
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="search-container">
                <svg
                  className="search-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  className="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for places, landmarks, or addresses..."
                  autoFocus
                />
                {listBusy && <div className="search-spinner spinner" />}
              </div>

              <div className="location-actions">
                <button
                  className="current-location-btn"
                  onClick={async () => {
                    try {
                      const { latitude, longitude } = await locate();
                      pinRef.current.setLngLat([longitude, latitude]);
                      mapRef.current.flyTo({
                        center: [longitude, latitude],
                        zoom: 16,
                      });
                      pushAddress(latitude, longitude);
                    } catch {
                      alert(
                        "Location unavailable. Please ensure location services are enabled."
                      );
                    }
                  }}
                  title="Use current location"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  Use Current Location
                </button>
              </div>
            </div>

            {opts.length > 0 && (
              <div className="suggestions">
                {opts.map((o) => (
                  <div
                    key={o.place_id}
                    className="suggestion-item"
                    onClick={() => {
                      const { lat, lon } = o;
                      pinRef.current.setLngLat([lon, lat]);
                      mapRef.current.flyTo({ center: [lon, lat], zoom: 16 });
                      pushAddress(lat, lon);
                      setQuery(o.formatted);
                      setOpts([]);
                    }}
                  >
                    <svg
                      className="suggestion-icon"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="suggestion-text">{o.formatted}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="map-container">
              <div id="ls-map" style={{ width: "100%", height: "100%" }}>
                {mapBusy && (
                  <div className="map-loading">
                    <div className="spinner" />
                    Loading interactive map...
                  </div>
                )}
              </div>
              <p className="map-credit">
                © OpenStreetMap contributors | © Geoapify
              </p>
            </div>

            <div className="location-footer">
              <button
                className="footer-btn cancel-btn"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="footer-btn save-btn"
                onClick={() => setOpen(false)}
              >
                💾 Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
