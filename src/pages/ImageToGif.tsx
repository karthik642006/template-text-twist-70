
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, X, Plus, ArrowLeft, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "@/components/HamburgerMenu";

const ImageToGif = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [frameDuration, setFrameDuration] = useState([500]);
  const [isLooping, setIsLooping] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);

  const sampleGifs = [
    {
      id: 1,
      name: "Fire Effect",
      url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      thumbnail: "https://media.giphy.com/media/13HgwGsXF0aiGY/200w.gif"
    },
    {
      id: 2,
      name: "Sparkles",
      url: "https://media.giphy.com/media/26BRtW4zppkY5a5ry/giphy.gif",
      thumbnail: "https://media.giphy.com/media/26BRtW4zppkY5a5ry/200w.gif"
    },
    {
      id: 3,
      name: "Rainbow",
      url: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
      thumbnail: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/200w.gif"
    },
    {
      id: 4,
      name: "Hearts",
      url: "https://media.giphy.com/media/3o6Mb8Do5WbIoLhF60/giphy.gif",
      thumbnail: "https://media.giphy.com/media/3o6Mb8Do5WbIoLhF60/200w.gif"
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setSelectedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGifUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedGif(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateGif = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsGenerating(true);
    
    // Simulate GIF generation process
    setTimeout(() => {
      // In a real implementation, this would process the images and create an actual GIF
      setGeneratedGif(selectedImages[0]); // Placeholder - would be actual generated GIF
      setIsGenerating(false);
      toast.success("GIF generated successfully!");
    }, 3000);
  };

  const downloadGif = () => {
    if (generatedGif) {
      const link = document.createElement('a');
      link.href = generatedGif;
      link.download = `generated-gif-${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("GIF downloaded successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-xl font-bold">Image to GIF</span>
          </div>
        </div>
        <HamburgerMenu />
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Animated GIFs
          </h1>
          <p className="text-gray-400">Convert your images into animated GIFs with custom effects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Settings */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700" asChild>
                      <span>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Images
                      </span>
                    </Button>
                  </label>
                  <p className="text-gray-400 text-sm mt-2">Select multiple images to create your GIF</p>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Frame ${index + 1}`}
                          className="w-full h-16 object-cover rounded border border-gray-600"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <Badge variant="secondary" className="absolute bottom-0 left-0 text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GIF Background Selection */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Background GIF (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="file"
                    accept="image/gif"
                    onChange={handleGifUpload}
                    className="hidden"
                    id="gif-upload"
                  />
                  <label htmlFor="gif-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Upload GIF</span>
                    </Button>
                  </label>
                </div>

                {/* Sample GIFs */}
                <div className="grid grid-cols-2 gap-2">
                  {sampleGifs.map((gif) => (
                    <div
                      key={gif.id}
                      onClick={() => setSelectedGif(gif.url)}
                      className={`cursor-pointer p-2 rounded border transition-colors ${
                        selectedGif === gif.url
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={gif.thumbnail}
                        alt={gif.name}
                        className="w-full h-16 object-cover rounded"
                      />
                      <p className="text-xs text-center mt-1">{gif.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Animation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Frame Duration: {frameDuration[0]}ms
                  </label>
                  <Slider
                    value={frameDuration}
                    onValueChange={setFrameDuration}
                    max={2000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="looping"
                    checked={isLooping}
                    onChange={(e) => setIsLooping(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="looping" className="text-sm text-gray-300">
                    Loop animation
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Generate */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Preview
                  {generatedGif && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-700/50 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {generatedGif ? (
                    <div className="space-y-4">
                      <img
                        src={generatedGif}
                        alt="Generated GIF"
                        className="max-w-full max-h-[250px] rounded border border-gray-600"
                        style={{ display: isPreviewPlaying ? 'block' : 'none' }}
                      />
                      {!isPreviewPlaying && (
                        <div className="w-64 h-64 bg-gray-600 rounded flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ) : selectedImages.length > 0 ? (
                    <div className="space-y-2">
                      <img
                        src={selectedImages[0]}
                        alt="Preview"
                        className="max-w-full max-h-[200px] rounded border border-gray-600"
                      />
                      <p className="text-gray-400 text-sm">
                        {selectedImages.length} frame{selectedImages.length !== 1 ? 's' : ''} ready
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Upload images to see preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generate & Download */}
            <div className="space-y-4">
              <Button
                onClick={generateGif}
                disabled={isGenerating || selectedImages.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating GIF...
                  </>
                ) : (
                  <>
                    Generate Animated GIF
                  </>
                )}
              </Button>

              {generatedGif && (
                <Button
                  onClick={downloadGif}
                  className="w-full bg-green-600 hover:bg-green-700 h-12"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download GIF
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageToGif;
