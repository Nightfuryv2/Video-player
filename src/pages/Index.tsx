import VideoPlayer from "../components/VideoPlayer";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { FileVideo, FolderOpen } from "lucide-react";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      console.log("Video loaded:", url);
    }
  };

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

  return (
    <div 
      className="min-h-screen bg-gray-900 p-4 md:p-8"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Media Player</h1>
          <p className="text-gray-300 mb-6">Drop video files here or choose a file to play</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="relative overflow-hidden flex items-center gap-2"
              onClick={() => document.getElementById("videoInput")?.click()}
            >
              <FolderOpen className="w-4 h-4" />
              Open File
              <input
                type="file"
                id="videoInput"
                className="hidden"
                accept="video/*"
                onChange={handleFileSelect}
              />
            </Button>
          </div>
        </div>
        
        {videoUrl ? (
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <VideoPlayer src={videoUrl} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-700 rounded-lg">
            <FileVideo className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-gray-400">Drag and drop a video file here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;