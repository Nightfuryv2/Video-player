import { useEffect, useRef, useState } from "react";
import { pipeline } from "@huggingface/transformers";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
}

interface Subtitle {
  text: string;
  start: number;
  end: number;
}

const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Update current subtitle
      const currentSub = subtitles.find(
        (sub) => video.currentTime >= sub.start && video.currentTime <= sub.end
      );
      setCurrentSubtitle(currentSub?.text || "");
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      console.log("Video duration:", video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [subtitles]);

  const generateSubtitles = async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsGeneratingSubtitles(true);
    console.log("Starting subtitle generation...");

    try {
      const transcriber = await pipeline(
        "automatic-speech-recognition",
        "openai/whisper-tiny.en",
        { device: "cpu" }
      );

      const result = await transcriber(video.src, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
      });

      console.log("Transcription result:", result);

      if (result.chunks) {
        const newSubtitles = result.chunks.map((chunk: any) => ({
          text: chunk.text,
          start: chunk.timestamp[0],
          end: chunk.timestamp[1],
        }));
        setSubtitles(newSubtitles);
        console.log("Generated subtitles:", newSubtitles);
      }
    } catch (error) {
      console.error("Error generating subtitles:", error);
    } finally {
      setIsGeneratingSubtitles(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onClick={togglePlay}
      />

      {/* Subtitles overlay */}
      {currentSubtitle && (
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <p className="text-white text-lg bg-black bg-opacity-50 px-4 py-2 inline-block rounded">
            {currentSubtitle}
          </p>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress bar */}
        <Slider
          value={[currentTime]}
          min={0}
          max={duration}
          step={0.1}
          onValueChange={handleProgressChange}
          className="mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white/80"
              onClick={generateSubtitles}
              disabled={isGeneratingSubtitles}
            >
              {isGeneratingSubtitles ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Subtitles"
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize /> : <Maximize />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;