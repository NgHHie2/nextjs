// app/ui/documents/video-viewer.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getVideoStreamUrl } from "@/app/lib/data/document-data";
import { cn } from "@/lib/utils";

interface VideoViewerProps {
  videoDoc: Document;
  semesterId?: number;
}

export default function VideoViewer({
  videoDoc,
  semesterId,
}: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

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
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videoUrl = getVideoStreamUrl(videoDoc.code, { semesterId });
  const maxRetries = 3;

  // Cleanup function
  const cleanup = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
      mouseMoveTimeoutRef.current = null;
    }

    // Cancel any pending play promise
    if (playPromiseRef.current) {
      playPromiseRef.current.catch(() => {
        // Ignore the error, we're cleaning up
      });
      playPromiseRef.current = null;
    }
  }, []);

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
  const hideControlsAndCursor = useCallback(() => {
    cleanup();

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);

    mouseMoveTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowCursor(false);
      }
    }, 2000);
  }, [isPlaying, cleanup]);

  const showControlsAndCursor = useCallback(() => {
    setShowControls(true);
    setShowCursor(true);

    // Only hide if playing
    if (isPlaying) {
      hideControlsAndCursor();
    }
  }, [isPlaying, hideControlsAndCursor]);

  // Safe play/pause functions
  const safePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isVideoReady) return;

    try {
      // Cancel any existing play promise
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
      }

      // Start new play promise
      playPromiseRef.current = video.play();
      await playPromiseRef.current;
      playPromiseRef.current = null;

      setIsPlaying(true);
    } catch (error: any) {
      playPromiseRef.current = null;
      console.warn("Play interrupted:", error);

      // Only set error if it's not an interruption
      if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
        setHasError(true);
      }
      setIsPlaying(false);
    }
  }, [isVideoReady]);

  const safePause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Wait for any pending play promise to complete
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }

      video.pause();
      setIsPlaying(false);
    } catch (error) {
      console.warn("Pause error:", error);
      setIsPlaying(false);
    }
  }, []);

  // Error handling with retry
  const handleError = useCallback(() => {
    cleanup();
    setIsLoading(false);
    setIsVideoReady(false);

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
  }, [retryCount, videoUrl, cleanup]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setIsVideoReady(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsVideoReady(true);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      setIsVideoReady(true);
    };

    const handleTimeUpdate = () => {
      // Throttle updates to avoid excessive re-renders
      setCurrentTime(Math.floor(video.currentTime));
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(0));
      }
    };

    // Add event listeners
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("error", handleError);

    return () => {
      // Cleanup event listeners
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("error", handleError);
    };
  }, [handleError]);

  // Reset timeouts when play state changes
  useEffect(() => {
    cleanup();

    // Show controls when paused
    if (!isPlaying) {
      setShowControls(true);
      setShowCursor(true);
    } else {
      // Start hide timer when playing
      hideControlsAndCursor();
    }
  }, [isPlaying, cleanup, hideControlsAndCursor]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    cleanup();
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsVideoReady(false);

    // Force reload with cache busting
    if (videoRef.current) {
      videoRef.current.src = `${videoUrl}?t=${Date.now()}`;
      videoRef.current.load();
    }
  }, [videoDoc.code, cleanup, videoUrl]);

  // Reset states when document changes
  useEffect(() => {
    cleanup();
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsVideoReady(false);
  }, [videoDoc.code, cleanup]);

  // Development optimizations - Add intersection observer for better performance
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting && isPlaying) {
          // Pause video when not visible to save resources
          safePause();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isPlaying, safePause]);

  // Control functions
  const togglePlay = useCallback(() => {
    if (!isVideoReady) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      safePlay();
    } else {
      safePause();
    }
  }, [isVideoReady, safePlay, safePause]);

  const handleSeek = useCallback(
    (value: number[]) => {
      const video = videoRef.current;
      if (!video || !isVideoReady) return;

      const newTime = Math.max(0, Math.min(duration, value[0]));
      video.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration, isVideoReady]
  );

  const handleVolumeChange = useCallback((value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      const newVolume = volume || 0.5;
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const handleContainerClick = useCallback(() => {
    showControlsAndCursor();
  }, [showControlsAndCursor]);

  const handleMouseMove = useCallback(() => {
    showControlsAndCursor();
  }, [showControlsAndCursor]);

  return (
    <div className="h-full flex flex-col rounded-xl shadow-sm bg-card text-card-foreground overflow-hidden">
      {/* Video Container */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading video...</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-foreground mb-2">Failed to load video</p>
              <p className="text-sm text-muted-foreground mb-4">
                The video might be corrupted or not supported.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  cleanup();
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
            className={cn(
              "relative h-full bg-background",
              isFullscreen && !showCursor ? "cursor-none" : ""
            )}
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-muted"
              crossOrigin="use-credentials"
              preload="metadata"
              playsInline
              controls={false}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Controls Overlay */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent transition-opacity duration-300 h-[60px]",
                showControls ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="p-4 space-y-1">
                {/* Progress Bar */}
                <div className="relative">
                  <Slider
                    value={[currentTime]}
                    max={duration || 0}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full z-50"
                    disabled={isLoading || hasError || !isVideoReady}
                  />
                  {/* Buffer indicator */}
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-muted-foreground/50 rounded-full -translate-y-1/2 pointer-events-none"
                    style={{
                      width:
                        duration > 0
                          ? `${(bufferedTime / duration) * 100}%`
                          : "0%",
                    }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-foreground">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="hover:bg-accent focus:ring-0 focus:outline-none p-2"
                      disabled={isLoading || hasError || !isVideoReady}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="hover:bg-accent focus:ring-0 focus:outline-none p-2"
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
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="hover:bg-accent focus:ring-0 focus:outline-none p-2"
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
