
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, Share, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TemplateEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [editingText, setEditingText] = useState<string>("");
  const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();

  // Your meme templates
  const memeTemplates = [
    {
      id: 1,
      title: "Online Friends Support",
      image: "/lovable-uploads/433cefc0-affd-4bf4-b3bd-7fb98f6e95b9.png",
      texts: ["My online friends, who I've never", "met in person, supporting me like:"]
    },
    {
      id: 2,
      title: "Client Reactions",
      image: "/lovable-uploads/8836bf2c-e2fb-4030-b798-0216ad7fb76a.png",
      texts: ["Me when a client wants changes", "Me when a client loves what I do"]
    }
  ];

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate({
      ...template,
      texts: [...template.texts] // Create a copy to avoid mutating original
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImages(prev => [...prev, imageUrl]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplaceImage = (newImageUrl: string) => {
    if (selectedTemplate) {
      setSelectedTemplate({
        ...selectedTemplate,
        image: newImageUrl
      });
      setShowReplaceDialog(false);
      toast({
        title: "Image replaced!",
        description: "Template image has been updated successfully."
      });
    }
  };

  const handleTextEdit = (index: number, newText: string) => {
    if (selectedTemplate) {
      const updatedTexts = [...selectedTemplate.texts];
      updatedTexts[index] = newText;
      setSelectedTemplate({
        ...selectedTemplate,
        texts: updatedTexts
      });
    }
  };

  const handleDownload = async () => {
    if (!selectedTemplate) return;
    
    try {
      // Create canvas to render the meme
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load the template image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Add text overlays
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        // Draw top text
        if (selectedTemplate.texts[0]) {
          ctx.strokeText(selectedTemplate.texts[0], canvas.width / 2, 50);
          ctx.fillText(selectedTemplate.texts[0], canvas.width / 2, 50);
        }
        
        // Draw bottom text
        if (selectedTemplate.texts[1]) {
          ctx.strokeText(selectedTemplate.texts[1], canvas.width / 2, canvas.height - 30);
          ctx.fillText(selectedTemplate.texts[1], canvas.width / 2, canvas.height - 30);
        }
        
        // Download the image
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `meme-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Download successful!",
              description: "Your meme has been downloaded."
            });
          }
        }, 'image/png');
      };
      img.src = selectedTemplate.image;
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Unable to download meme. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this meme!',
          text: 'I created this awesome meme!',
          url: window.location.href,
        });
        toast({
          title: "Shared successfully!",
          description: "Your meme has been shared."
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Meme link copied to clipboard. Share it anywhere!"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Unable to share. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-xl font-bold">Template Editor</span>
        </div>
      </header>

      <main className="p-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Edit Meme Templates
          </h1>
          <p className="text-gray-400">Select a template, customize text and images</p>
        </div>

        {!selectedTemplate ? (
          // Template Selection
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Choose a Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer transform transition-transform hover:scale-105"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <Card className="bg-gray-700/50 border-gray-600 hover:border-purple-400 transition-colors">
                      <CardContent className="p-4">
                        <img 
                          src={template.image} 
                          alt={template.title}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold text-white text-center">{template.title}</h3>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Template Editor
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Template Preview */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Template Preview</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <img 
                    src={selectedTemplate.image} 
                    alt="Template"
                    className="w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setShowReplaceDialog(true)}
                  />
                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                    {selectedTemplate.texts.map((text: string, index: number) => (
                      <div
                        key={index}
                        className={`text-white font-bold text-lg text-center cursor-pointer pointer-events-auto px-2 py-1 rounded ${index === 0 ? 'self-start' : 'self-end'}`}
                        style={{
                          textShadow: '2px 2px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000',
                          WebkitTextStroke: '1px #000000'
                        }}
                        onClick={() => {
                          setEditingTextIndex(index);
                          setEditingText(text);
                        }}
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowReplaceDialog(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Replace Image
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Text Editor */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Edit Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate.texts.map((text: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm text-gray-400">
                      {index === 0 ? 'Top Text' : 'Bottom Text'}
                    </label>
                    <Input
                      value={text}
                      onChange={(e) => handleTextEdit(index, e.target.value)}
                      placeholder={`Enter ${index === 0 ? 'top' : 'bottom'} text...`}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Text Editing Dialog */}
        {editingTextIndex !== null && (
          <Dialog open={true} onOpenChange={() => setEditingTextIndex(null)}>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Text</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  placeholder="Enter your text..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      handleTextEdit(editingTextIndex, editingText);
                      setEditingTextIndex(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingTextIndex(null)}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Replace Image Dialog */}
        <Dialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Replace Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">Click to upload a new image</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF supported</p>
                </label>
              </div>

              {/* Gallery */}
              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Your Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => handleReplaceImage(imageUrl)}
                      >
                        <img 
                          src={imageUrl} 
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-600 hover:border-purple-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default Images */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Default Templates</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {memeTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="cursor-pointer transform transition-transform hover:scale-105"
                      onClick={() => handleReplaceImage(template.image)}
                    >
                      <img 
                        src={template.image} 
                        alt={template.title}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-600 hover:border-purple-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TemplateEditor;
