import VideoPlayer from "../components/VideoPlayer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      console.log("Video dropped:", url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      console.log("Video selected:", url);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('video-upload') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div 
      className="min-h-screen bg-gray-900 flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {videoUrl ? (
        <div className="w-full h-screen max-w-6xl mx-auto">
          <VideoPlayer src={videoUrl} />
        </div>
      ) : (
        <div className="text-white text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
          <p className="text-xl">Drag and drop a video file here to play</p>
          <p className="text-sm text-gray-400 mt-2">Supported formats: MP4, WebM, OGG</p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={triggerFileInput}
            >
              <FolderOpen className="w-4 h-4" />
              Choose from computer
            </Button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;