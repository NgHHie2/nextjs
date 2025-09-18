// app/ui/documents/video-viewer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Document } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCw,
  SkipBack,
  SkipForward,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getVideoStreamUrl } from "@/app/lib/data/document-data";

interface VideoViewerProps {
  videoDoc: Document;
}

export default function VideoViewer({ videoDoc }: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [bufferedTime, setBufferedTime] = useState(0);

  const videoUrl = getVideoStreamUrl(videoDoc.code);
  const maxRetries = 3;

  // Format time helper
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Auto-hide controls and cursor
  const hideControlsAndCursor = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    mouseMoveTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowCursor(false);
      }
    }, 3000);
  };

  const showControlsAndCursor = () => {
    setShowControls(true);
    setShowCursor(true);

    // Only hide if in fullscreen and playing
    if (isPlaying) {
      hideControlsAndCursor();
    }
  };

  // Reset timeouts when play state or fullscreen changes
  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
    }

    // Show controls when paused or not in fullscreen
    if (!isPlaying) {
      setShowControls(true);
      setShowCursor(true);
    } else {
      // Start hide timer when playing in fullscreen
      hideControlsAndCursor();
    }
  }, [isPlaying]);

  // Error handling with retry
  const handleError = () => {
    setIsLoading(false);
    if (retryCount < maxRetries) {
      const nextRetry = retryCount + 1;
      console.warn(`Video error. Retrying ${nextRetry}/${maxRetries}...`);
      setRetryCount(nextRetry);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = `${videoUrl}?retry=${Date.now()}`;
          videoRef.current.load();
        }
      }, 2000);
    } else {
      setHasError(true);
    }
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(0));
      }
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("error", handleError);
    };
  }, [retryCount]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Reset states when document changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [videoDoc.code]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
    };
  }, []);

  // Control functions
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      console.log("play");
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(
      0,
      Math.min(duration, video.currentTime + seconds)
    );
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleContainerClick = () => {
    // if (isFullscreen) {
    showControlsAndCursor();
    // }
  };

  const handleMouseMove = () => {
    // if (isFullscreen) {
    showControlsAndCursor();
    // }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border">
      {/* Video Container */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading video...</p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Retry attempt {retryCount}/{maxRetries}
                </p>
              )}
            </div>
          </div>
        )}

        {hasError ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-gray-600 mb-2">Failed to load video</p>
              <p className="text-sm text-gray-500 mb-4">
                The video might be corrupted or not supported.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setHasError(false);
                  setRetryCount(0);
                  setIsLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className={`relative h-full bg-black ${
              isFullscreen && !showCursor ? "cursor-none" : ""
            }`}
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              style={{ backgroundColor: "hsl(var(--muted))" }}
              crossOrigin="use-credentials"
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Controls Overlay */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="p-4 space-y-2">
                {/* Progress Bar */}
                <div className="relative">
                  <Slider
                    value={[currentTime]}
                    max={duration || 0}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full z-50"
                    disabled={isLoading || hasError}
                  />
                  {/* Buffer indicator */}
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-gray-400 rounded-full -translate-y-1/2 pointer-events-none"
                    style={{ width: `${(bufferedTime / duration) * 100}%` }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                      disabled={isLoading || hasError}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                        disabled={isLoading || hasError}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="w-20">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          disabled={isLoading || hasError}
                        />
                      </div>
                    </div>

                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                    disabled={isLoading || hasError}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
