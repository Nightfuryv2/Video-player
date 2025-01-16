import VideoPlayer from "../components/VideoPlayer";
import { useState } from "react";

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
        </div>
      )}
    </div>
  );
};

export default Index;