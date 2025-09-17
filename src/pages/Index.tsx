import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, Sparkles, Zap, Image, Palette, Video, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TemplateGallery from "@/components/TemplateGallery";
import GifGenerator from "@/components/GifGenerator";
import TemplateSearch from "@/components/TemplateSearch";
import Header from "@/components/Header";
import UserDashboard from "@/components/UserDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [textPrompt, setTextPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const handleGenerateImage = async () => {
    if (!textPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your meme image",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-meme-image', {
        body: {
          prompt: textPrompt.trim(),
          layout: "single"
        }
      });
      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Success!",
          description: "Your meme image has been generated"
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTemplate = () => {
    if (generatedImage) {
      // Store the generated image in localStorage to pass to editor
      localStorage.setItem('selectedTemplate', generatedImage);
      navigate('/editor/generated');
    }
  };

  const popularTemplates = [{
    id: 1,
    name: "Distracted Boyfriend",
    image: "https://i.imgflip.com/1ur9b0.jpg"
  }, {
    id: 2,
    name: "Drake Pointing",
    image: "https://i.imgflip.com/30b1gx.jpg"
  }, {
    id: 3,
    name: "Woman Yelling at Cat",
    image: "https://i.imgflip.com/345v97.jpg"
  }, {
    id: 4,
    name: "Two Buttons",
    image: "https://i.imgflip.com/1g8my4.jpg"
  }];

  const animations = [{
    id: 1,
    name: "Curl Hair",
    preview: "https://i.imgflip.com/1g8my4.jpg"
  }, {
    id: 2,
    name: "Fly Up",
    preview: "https://i.imgflip.com/30b1gx.jpg"
  }];

  if (activeTab === "templates") {
    return <TemplateGallery />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30 px-3 py-1">
                <Sparkles className="mr-1 h-3 w-3" />
                New AI Features
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Create Epic Memes
              <br />
              <span className="text-3xl md:text-5xl">with AI Magic</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Turn your ideas into viral memes in seconds. Our AI-powered tools make meme creation fun, fast, and incredibly easy.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-8 py-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1M+</div>
              <div className="text-sm text-gray-400">Memes Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-sm text-gray-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-sm text-gray-400">User Rating</div>
            </div>
          </div>
        </section>

        {/* User Dashboard for authenticated users */}
        {user && !loading && (
          <section>
            <UserDashboard />
          </section>
        )}

        {/* AI Meme Generator */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center space-x-2">
              <Zap className="h-8 w-8 text-yellow-400" />
              <span>AI Meme Generator</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Describe your meme idea and watch our AI bring it to life instantly
            </p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Image className="h-5 w-5 text-blue-400" />
                <span>Text to Meme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Describe the meme you want to create... (e.g., 'A cat looking confused at a computer screen')" 
                value={textPrompt} 
                onChange={e => setTextPrompt(e.target.value)} 
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[120px] text-lg" 
              />
              <Button 
                onClick={handleGenerateImage} 
                disabled={isGenerating || !textPrompt.trim()} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-12 text-lg font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Meme...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Meme
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Generated Image Display */}
              {generatedImage && (
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <img 
                      src={generatedImage} 
                      alt="Generated meme template" 
                      className="w-full h-80 object-cover rounded-xl border border-gray-600 shadow-2xl" 
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        <Star className="mr-1 h-3 w-3" />
                        AI Generated
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={handleUseTemplate} 
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-medium"
                  >
                    <Palette className="mr-2 h-5 w-5" />
                    Edit This Meme
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Feature Cards */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Powerful Tools</h2>
            <p className="text-gray-400">Everything you need to create amazing memes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors group cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">AI Image Generator</h3>
                <p className="text-gray-400">Create custom meme images from text descriptions using advanced AI</p>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Most Popular
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors group cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Palette className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Template Editor</h3>
                <p className="text-gray-400">Choose from thousands of popular meme templates and customize them</p>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  1000+ Templates
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors group cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">GIF Creator</h3>
                <p className="text-gray-400">Turn your images into animated GIFs with custom effects and timing</p>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  Animated
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Template Search Section */}
        <TemplateSearch />

        {/* Image to GIF Section */}
        <section>
          <GifGenerator />
        </section>
      </main>
    </div>
  );
};

export default Index;
