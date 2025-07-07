
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ArrowRight, Download, X } from "lucide-react";
import { toast } from "sonner";

const GifGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGifs, setGeneratedGifs] = useState<Array<{
    id: number;
    url: string;
    effect: string;
  }>>([]);

  const gifEffects = [
    {
      id: 1,
      name: "Fade In/Out",
      preview: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
      description: "Smooth fade animation"
    },
    {
      id: 2,
      name: "Zoom In/Out",
      preview: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
      description: "Zoom effect animation"
    },
    {
      id: 3,
      name: "Rotate",
      preview: "https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/giphy.gif",
      description: "Spinning rotation effect"
    },
    {
      id: 4,
      name: "Bounce",
      preview: "https://media.giphy.com/media/3oEjHLzm4BCF8zfPy0/giphy.gif",
      description: "Bouncing animation"
    },
    {
      id: 5,
      name: "Shake",
      preview: "https://media.giphy.com/media/3oEjHChKVxgKFLM3eq/giphy.gif",
      description: "Shaking movement"
    },
    {
      id: 6,
      name: "Pulse",
      preview: "https://media.giphy.com/media/3oEjHQOeg7u6wsWGWY/giphy.gif",
      description: "Pulsing effect"
    },
    {
      id: 7,
      name: "Slide Left",
      preview: "https://media.giphy.com/media/3oEjHV0z8S7WM4MwnK/giphy.gif",
      description: "Sliding from right to left"
    },
    {
      id: 8,
      name: "Slide Right",
      preview: "https://media.giphy.com/media/3oEjHLTKKJRYKhGdUY/giphy.gif",
      description: "Sliding from left to right"
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateGif = async () => {
    if (!selectedImage || !selectedEffect) {
      toast.error("Please select an image and animation effect");
      return;
    }

    setIsGenerating(true);

    // Simulate GIF generation process
    setTimeout(() => {
      const newGif = {
        id: Date.now(),
        url: selectedImage, // In a real app, this would be the generated GIF URL
        effect: selectedEffect
      };
      setGeneratedGifs(prev => [...prev, newGif]);
      setIsGenerating(false);
      toast.success(`GIF with ${selectedEffect} effect generated successfully!`);
    }, 3000);
  };

  const downloadGif = (gif: { id: number; url: string; effect: string }) => {
    // Create a temporary link to download the GIF
    const link = document.createElement('a');
    link.href = gif.url;
    link.download = `animated-${gif.effect.toLowerCase().replace(/\s+/g, '-')}-${gif.id}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("GIF downloaded successfully!");
  };

  const removeGif = (id: number) => {
    setGeneratedGifs(prev => prev.filter(gif => gif.id !== id));
    toast.success("GIF removed");
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Image to GIF Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Upload Image</h3>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="gif-image-upload"
            />
            <label htmlFor="gif-image-upload">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer" 
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </span>
              </Button>
            </label>
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-16 h-16 object-cover rounded border border-gray-600" 
              />
            )}
          </div>
        </div>

        {/* Animation Effects Grid */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Choose Animation Effect</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gifEffects.map((effect) => (
              <div
                key={effect.id}
                onClick={() => setSelectedEffect(effect.name)}
                className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                  selectedEffect === effect.name
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-700/50 hover:bg-gray-600/50'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-white">{effect.name}</div>
                  <div className="text-xs text-gray-400">{effect.description}</div>
                  {selectedEffect === effect.name && (
                    <Badge className="bg-blue-500">Selected</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateGif}
          disabled={isGenerating || !selectedImage || !selectedEffect}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating GIF...
            </>
          ) : (
            <>
              Generate Animated GIF
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Generated GIFs Display */}
        {generatedGifs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Generated GIFs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedGifs.map((gif) => (
                <Card key={gif.id} className="bg-gray-700/50 border-gray-600">
                  <CardContent className="p-4">
                    <img
                      src={gif.url}
                      alt={`Generated GIF with ${gif.effect} effect`}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{gif.effect}</Badge>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => downloadGif(gif)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeGif(gif.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GifGenerator;
