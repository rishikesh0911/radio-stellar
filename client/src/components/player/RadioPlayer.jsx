import { useEffect, useRef, useState } from "react";

import {
  Pause,
  Play,
  Radio,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function RadioPlayer({ station }) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState(
    "Choose a station on the globe to start listening"
  );

  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.src = station?.url_resolved || "";

    setPlaying(false);

    setStatus(
      station
        ? "Ready to tune in"
        : "Choose a station on the globe to start listening"
    );

    if (station?.url_resolved) {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setStatus("Now playing");
        })
        .catch(() => {
          setPlaying(false);
          setStatus(
            "Playback unavailable — try another station"
          );
        });
    }

    return () => audio.pause();
  }, [station]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || !station?.url_resolved) return;

    if (playing) {
      audio.pause();

      setPlaying(false);
      setStatus("Paused");

      return;
    }

    try {
      await audio.play();

      setPlaying(true);
      setStatus("Now playing");
    } catch {
      setPlaying(false);
      setStatus("This station could not be played");
    }
  }

  return (
    <section className="player-bar" aria-label="Radio player">
      <audio
        ref={audioRef}
        onPlaying={() => {
          setPlaying(true);
          setStatus("Now playing");
        }}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setStatus("Stream unavailable");
        }}
      />

      <div className="player-station">
        <div className="station-art">
          <Radio size={21} />
        </div>

        <div className="station-meta">
          <strong>
            {station?.name || "Nothing playing yet"}
          </strong>

          <span>
            {station
              ? [station.country, station.state]
                  .filter(Boolean)
                  .join(" · ")
              : status}
          </span>
        </div>
      </div>

      <div className="player-controls">
        <button
          className="play-button"
          onClick={togglePlayback}
          disabled={!station?.url_resolved}
          aria-label={playing ? "Pause station" : "Play station"}
        >
          {playing ? (
            <Pause size={19} fill="currentColor" />
          ) : (
            <Play size={19} fill="currentColor" />
          )}
        </button>

        <div className="playback-status">
          <span
            className={
              playing
                ? "equalizer active"
                : "equalizer"
            }
          >
            <i />
            <i />
            <i />
            <i />
          </span>

          {status}
        </div>
      </div>

      <div className="volume-control">
        <button
          className="icon-button"
          onClick={() => setMuted((value) => !value)}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted || volume === 0 ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </button>

        <input
          aria-label="Volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) =>
            setVolume(Number(event.target.value))
          }
        />
      </div>
    </section>
  );
}