import VideoPlayer from "../components/VideoPlayer";
import { Button } from "../components/ui/button";
import { useState } from "react";

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

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">AI-Powered Video Player</h1>
          <p className="text-gray-300 mb-6">Upload a video to get started with AI-generated subtitles</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              onClick={() => document.getElementById("videoInput")?.click()}
            >
              Choose Video File
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
        
        {videoUrl && (
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <VideoPlayer src={videoUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;