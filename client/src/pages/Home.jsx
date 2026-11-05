import { useEffect, useMemo, useState } from "react";
import {
  Globe2,
  LoaderCircle,
  Radio,
  Search,
  Volume2,
} from "lucide-react";

import GlobeScene from "../components/globe/GlobeScene";
import RadioPlayer from "../components/player/RadioPlayer";
import {
  getPopularStations,
  searchStations,
} from "../services/stationService";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPopularStations()
      .then((items) => {
        if (!active) return;

        const validStations = (items || []).filter(
          (station) =>
            Number.isFinite(Number(station.geo_lat)) &&
            Number.isFinite(Number(station.geo_long)) &&
            station.geo_lat !== null &&
            station.geo_long !== null
        );

        setStations(validStations);
      })
      .catch(() => {
        if (active) {
          setError(
            "We couldn't load radio stations. Check that the backend is running and try again."
          );
        }
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const visibleStations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return stations;

    return stations.filter((station) =>
      [station.name, station.country, station.tags]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(normalizedQuery)
        )
    );
  }, [query, stations]);

  async function handleSearch(event) {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      try {
        const items = await getPopularStations();
        setStations(items || []);
      } catch {
        setError("Search is temporarily unavailable. Please try again.");
      }

      return;
    }

    setLoading(true);
    setError("");

    try {
      const items = await searchStations({
        name: value,
        limit: 100,
      });

      setStations(
        (items || []).filter(
          (station) =>
            station.geo_lat !== null &&
            station.geo_long !== null &&
            Number.isFinite(Number(station.geo_lat)) &&
            Number.isFinite(Number(station.geo_long))
        )
      );
    } catch {
      setError(
        "We couldn't search stations right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="radio-app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Radio Stellar home">
          <span className="brand-mark">
            <Radio size={19} />
          </span>

          <span>
            radio<span className="brand-accent">stellar</span>
          </span>
        </a>

        <div className="topbar-caption">
          <span className="live-dot" />
          LIVE RADIO, AROUND THE WORLD
        </div>

        <div className="station-count">
          <Globe2 size={15} />
          {stations.length} stations on the globe
        </div>
      </header>

      <section
        className="explorer"
        aria-label="Explore global radio stations"
      >
        <div className="explorer-heading">
          <div>
            <p className="eyebrow">YOUR WORLD. YOUR SOUND.</p>

            <h1>
              Find your <span>frequency.</span>
            </h1>

            <p className="intro-copy">
              Spin the globe. Discover a radio station. Hear somewhere new.
            </p>
          </div>

          <form className="station-search" onSubmit={handleSearch}>
            <Search size={17} />

            <input
              aria-label="Search stations"
              placeholder="Search station, country or genre"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <button type="submit">Search</button>
          </form>
        </div>

        <div className="globe-stage">
          <div className="globe-hint">
            <span className="hint-dot" />
            DRAG TO EXPLORE
            <span>·</span>
            SELECT A PULSE TO LISTEN
          </div>

          {loading && (
            <div className="loading-state">
              <LoaderCircle className="spin" size={20} />
              Finding stations around the world…
            </div>
          )}

          {error && (
            <div className="error-state" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && visibleStations.length === 0 && (
            <div className="empty-state">
              No stations found. Try another search.
            </div>
          )}

          <GlobeScene
            stations={visibleStations}
            selectedId={selectedStation?.stationuuid}
            onSelectStation={setSelectedStation}
          />

          <div className="globe-footer">
            <span>EARTH / 01</span>
            <span>
              <Volume2 size={13} />
              SOUND CONNECTS US
            </span>
          </div>
        </div>
      </section>

      <RadioPlayer station={selectedStation} />

      <footer className="app-footer">
        <span>RADIO STELLAR</span>
        <span>Explore beyond your borders.</span>
        <span>POWERED BY RADIO BROWSER</span>
      </footer>
    </main>
  );
}