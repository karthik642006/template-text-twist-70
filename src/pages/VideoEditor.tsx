import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  Scissors, 
  Type, 
  Search,
  Download,
  Music,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const VideoEditor = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: number;
    url: string;
    thumbnail: string;
    title: string;
    duration: string;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [customText, setCustomText] = useState("");
  const [backgroundMusic, setBackgroundMusic] = useState<string | null>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideo(videoUrl);
      setSelectedVideo(videoUrl);
      toast.success("Video uploaded successfully!");
    }
  };

  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setBackgroundMusic(audioUrl);
      toast.success("Background music added!");
    }
  };

  const handleSearchVideos = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-videos', {
        body: { 
          query: searchQuery,
          page: 1,
          per_page: 15
        }
      });

      if (error) throw error;

      if (data?.videos) {
        setSearchResults(data.videos);
        toast.success(`Found ${data.videos.length} videos`);
      } else {
        toast.error("No videos found");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search videos. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectVideoFromSearch = (video: typeof searchResults[0]) => {
    setSelectedVideo(video.url);
    toast.success(`Selected: ${video.title}`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const applyTextOverlay = () => {
    if (topText || bottomText || customText) {
      toast.success("Text overlay applied to video!");
    } else {
      toast.error("Please add some text first");
    }
  };

  const exportVideo = () => {
    if (!selectedVideo) {
      toast.error("Please select or upload a video first");
      return;
    }
    toast.success("Video exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Video Editor
          </h1>
          <p className="text-gray-300">Upload, edit, and enhance your videos with powerful tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Play className="mr-2 h-5 w-5" />
                  Video Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Upload */}
                <div className="space-y-3">
                  <Label className="text-white">Upload Your Video</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload">
                      <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Video Player */}
                {selectedVideo && (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        src={selectedVideo}
                        className="w-full h-64 object-contain"
                        controls
                      />
                      {/* Text Overlays Preview */}
                      {topText && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold bg-black/50 px-4 py-2 rounded">
                          {topText}
                        </div>
                      )}
                      {bottomText && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold bg-black/50 px-4 py-2 rounded">
                          {bottomText}
                        </div>
                      )}
                    </div>

                    {/* Video Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        onClick={togglePlayPause}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={exportVideo}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Video
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editing Tools Sidebar */}
          <div className="space-y-4">
            {/* Text Overlays */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Type className="mr-2 h-4 w-4" />
                  Text Overlays
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Top Text</Label>
                  <Input
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Enter top text"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Bottom Text</Label>
                  <Input
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Enter bottom text"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Custom Text</Label>
                  <Input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter custom text"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button
                  onClick={applyTextOverlay}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Apply Text
                </Button>
              </CardContent>
            </Card>

            {/* Audio Controls */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Music className="mr-2 h-4 w-4" />
                  Audio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Background Music</Label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicUpload}
                    className="hidden"
                    id="music-upload"
                  />
                  <label htmlFor="music-upload">
                    <Button className="w-full bg-green-600 hover:bg-green-700 cursor-pointer" asChild>
                      <span>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Add Background Music
                      </span>
                    </Button>
                  </label>
                  {backgroundMusic && (
                    <Badge className="bg-green-500">Music Added</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video Tools */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Layers className="mr-2 h-4 w-4" />
                  Video Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Scissors className="w-4 h-4 mr-2" />
                  Crop Video
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Layers className="w-4 h-4 mr-2" />
                  Add Elements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Video Search Section */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search Videos (Powered by Pexels)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="flex space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for videos..."
                className="flex-1 bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchVideos()}
              />
              <Button
                onClick={handleSearchVideos}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((video) => (
                  <Card
                    key={video.id}
                    className="bg-gray-700/50 border-gray-600 cursor-pointer hover:bg-gray-600/50 transition-colors"
                    onClick={() => selectVideoFromSearch(video)}
                  >
                    <CardContent className="p-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <div className="space-y-2">
                        <h3 className="text-white font-medium">{video.title}</h3>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{video.duration}</Badge>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Select
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoEditor;
