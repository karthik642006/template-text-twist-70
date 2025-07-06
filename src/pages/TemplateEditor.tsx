
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Crop, Layout, Image as ImageIcon, Grid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TemplateEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast({
          title: "Success",
          description: "Template uploaded successfully!",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const templateTypes = [
    {
      id: "blank",
      title: "Blank Template",
      description: "Start with a blank canvas",
      icon: Layout,
    },
    {
      id: "single",
      title: "Single Image",
      description: "One image with text areas",
      icon: ImageIcon,
    },
    {
      id: "topBottom",
      title: "Top & Bottom Images",
      description: "Two images stacked vertically",
      icon: Layout,
    },
    {
      id: "leftRight",
      title: "Left & Right Images",
      description: "Two images side by side",
      icon: Layout,
    },
    {
      id: "fourImages",
      title: "Four Images Grid",
      description: "2x2 grid of images",
      icon: Grid,
    },
  ];

  const handleCreateTemplate = (templateType: string) => {
    toast({
      title: "Template Created",
      description: `${templateType} template created successfully!`,
    });
    // Here you would implement the actual template creation logic
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
            Create Custom Templates
          </h1>
          <p className="text-gray-400">Upload, crop, and create your own meme templates</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Upload className="w-5 h-5" />
              <span>Upload Template</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="template-upload"
              />
              <label htmlFor="template-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300">Click to upload your template image</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF supported</p>
              </label>
            </div>
            
            {uploadedImage && (
              <div className="space-y-4">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded template" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Crop className="w-4 h-4 mr-2" />
                  Crop Template
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Types */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Create Template from Blank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templateTypes.map((template) => (
                <Card key={template.id} className="bg-gray-700/50 border-gray-600 hover:border-purple-400 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center space-y-3">
                    <template.icon className="w-12 h-12 mx-auto text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">{template.title}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                    <Button
                      onClick={() => handleCreateTemplate(template.title)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Create
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TemplateEditor;
