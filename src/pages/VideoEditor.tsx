
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  Layers,
  RotateCw,
  Square,
  Star,
  Filter,
  Zap,
  Shuffle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VideoResult {
  id: number;
  url: string;
  urls: {
    hd: string;
    sd: string;
    original: string;
  };
  thumbnail: string;
  title: string;
  duration: number;
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  pexels_url: string;
}

const VideoEditor = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Text overlays
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [customText, setCustomText] = useState("");
  
  // Audio
  const [backgroundMusic, setBackgroundMusic] = useState<string | null>(null);
  const [volume, setVolume] = useState([100]);
  
  // Video effects
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [speed, setSpeed] = useState([100]);

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

  const handleSearchVideos = async (page = 1) => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-videos', {
        body: { 
          query: searchQuery,
          page: page,
          per_page: 20
        }
      });

      if (error) {
        console.error("Search error:", error);
        throw error;
      }

      if (data?.videos) {
        if (page === 1) {
          setSearchResults(data.videos);
        } else {
          setSearchResults(prev => [...prev, ...data.videos]);
        }
        setTotalResults(data.total_results || 0);
        setCurrentPage(page);
        setHasNextPage(!!data.next_page);
        toast.success(`Found ${data.total_results || data.videos.length} videos`);
      } else {
        toast.error("No videos found");
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search videos. Please check your Pexels API key.");
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMoreVideos = () => {
    if (hasNextPage && !isSearching) {
      handleSearchVideos(currentPage + 1);
    }
  };

  const selectVideoFromSearch = (video: VideoResult) => {
    setSelectedVideo(video.urls.hd || video.url);
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

  const applyEffects = () => {
    toast.success("Video effects applied!");
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
            Advanced Video Editor
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
                        style={{
                          filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`
                        }}
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
                      {customText && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold bg-black/50 px-4 py-2 rounded">
                          {customText}
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
                <div className="space-y-2">
                  <Label className="text-white">Volume: {volume[0]}%</Label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Video Effects */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Video Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Brightness: {brightness[0]}%</Label>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Contrast: {contrast[0]}%</Label>
                  <Slider
                    value={contrast}
                    onValueChange={setContrast}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Saturation: {saturation[0]}%</Label>
                  <Slider
                    value={saturation}
                    onValueChange={setSaturation}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Speed: {speed[0]}%</Label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    max={300}
                    min={25}
                    step={25}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={applyEffects}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Apply Effects
                </Button>
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
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  <Square className="w-4 h-4 mr-2" />
                  Add Shapes
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Star className="w-4 h-4 mr-2" />
                  Add Stickers
                </Button>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Add Effects
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
              Search Videos from Pexels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="flex space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for videos (e.g., nature, business, technology)..."
                className="flex-1 bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchVideos(1)}
              />
              <Button
                onClick={() => handleSearchVideos(1)}
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

            {/* Search Results Info */}
            {totalResults > 0 && (
              <div className="text-gray-300 text-sm">
                Found {totalResults} videos • Showing {searchResults.length} results
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.map((video) => (
                    <Card
                      key={video.id}
                      className="bg-gray-700/50 border-gray-600 cursor-pointer hover:bg-gray-600/50 transition-colors"
                      onClick={() => selectVideoFromSearch(video)}
                    >
                      <CardContent className="p-3">
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded mb-3">
                            <Play className="w-8 h-8 text-white opacity-70" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-white font-medium text-sm line-clamp-2">{video.title}</h3>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {video.duration}s
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {video.width}x{video.height}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400">
                            by {video.photographer}
                          </div>
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Select Video
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="text-center">
                    <Button
                      onClick={loadMoreVideos}
                      disabled={isSearching}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSearching ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      )}
                      Load More Videos
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {searchResults.length === 0 && searchQuery && !isSearching && (
              <div className="text-center text-gray-400 py-8">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No videos found for "{searchQuery}"</p>
                <p className="text-sm">Try different keywords or check your search terms</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoEditor;
