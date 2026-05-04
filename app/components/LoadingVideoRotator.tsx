"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

function shuffle(values: string[]) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function LoadingVideoRotator({
  videos,
  intervalMs = 0
}: {
  videos: string[];
  intervalMs?: number;
}) {
  const playlist = useMemo(() => shuffle(videos.filter(Boolean)), [videos]);
  const [index, setIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const normalizedIntervalMs = Number.isFinite(intervalMs) ? Math.max(0, intervalMs) : 0;

  useEffect(() => {
    if (playlist.length <= 1) return;
    if (normalizedIntervalMs <= 0) return;
    const handle = window.setInterval(() => {
      setIndex(prev => (prev + 1) % playlist.length);
    }, normalizedIntervalMs);
    return () => window.clearInterval(handle);
  }, [normalizedIntervalMs, playlist.length]);

  if (!playlist.length) return null;

  const src = playlist[index] || playlist[0];

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        void videoRef.current.play().catch(() => null);
      }
    }
  };

  const handleVideoError = () => {
    console.error(`[LoadingVideoRotator] Error playing video: ${src}`);
    if (playlist.length > 1) {
      setIndex(prev => (prev + 1) % playlist.length);
    }
  };

  const handleVideoEnded = () => {
    if (normalizedIntervalMs > 0) return;
    if (playlist.length > 1) {
      setIndex(prev => (prev + 1) % playlist.length);
    }
  };

  return (
    <div className="absolute inset-0">
      <video
        key={src}
        ref={videoRef}
        src={src}
        autoPlay
        muted={isMuted}
        loop={playlist.length <= 1 || normalizedIntervalMs > 0}
        playsInline
        crossOrigin="anonymous"
        preload="metadata"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={handleToggleMute}
        className="absolute right-3 bottom-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-[2px] hover:bg-black/55 transition-colors"
        aria-label={isMuted ? "Включить звук" : "Выключить звук"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
