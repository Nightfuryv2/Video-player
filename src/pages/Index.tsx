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
      className="min-h-screen bg-gray-900"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {videoUrl && (
        <div className="h-screen">
          <VideoPlayer src={videoUrl} />
        </div>
      )}
    </div>
  );
};

export default Index;