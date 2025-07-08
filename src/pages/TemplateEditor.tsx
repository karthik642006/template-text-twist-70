import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Share, X, Plus, Move, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateElement {
  id: number;
  type: 'text' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
}

interface Template {
  id: number;
  title: string;
  image: string;
  texts: string[];
  type: 'preset' | 'custom';
  layout?: 'single' | 'double' | 'triple' | 'quad' | 'grid';
  elements?: TemplateElement[];
}

const TemplateEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [editingText, setEditingText] = useState<string>("");
  const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImageToCrop, setSelectedImageToCrop] = useState<string>("");
  const [activeTab, setActiveTab] = useState("templates");
  const [customElements, setCustomElements] = useState<TemplateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Expanded meme templates with new ones from uploaded images
  const memeTemplates: Template[] = [
    {
      id: 1,
      title: "Amazing Testimonial Cat",
      image: "/lovable-uploads/933e6d2e-505a-43f6-ab62-6b18db8f6734.png",
      texts: ["When I receive an amazing", "testimonial from a client."],
      type: 'preset'
    },
    {
      id: 2,
      title: "Client Ghost Response",
      image: "/lovable-uploads/5d506de7-58f4-42e8-aa87-a57c7b5e4bd1.png",
      texts: ["Me: Just checking you got the", "proposal I sent over?", "Client:"],
      type: 'preset'
    },
    {
      id: 3,
      title: "Crush Rejection Cycle",
      image: "/lovable-uploads/2d1b0756-bc7d-4b2b-ba9a-e8292a298491.png",
      texts: ["When your crush rejects you and then her crush", "rejected her", "Me :"],
      type: 'preset'
    },
    {
      id: 4,
      title: "Work From Home Snacks",
      image: "/lovable-uploads/5cd07c15-8ca4-4e61-b8a2-4d82ff239b98.png",
      texts: ["When there's snacks in the house", "and you work from home"],
      type: 'preset'
    },
    {
      id: 5,
      title: "Reaction Faces",
      image: "/lovable-uploads/a4c645a4-8f7e-4c11-8f3f-79655da89d08.png",
      texts: ["Top Text", "Middle Text", "Bottom Text"],
      type: 'preset'
    },
    {
      id: 6,
      title: "Monthly Mood Calendar",
      image: "/lovable-uploads/6aafe006-7b3e-4c69-be74-58ed766f1cb2.png",
      texts: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"],
      type: 'preset'
    },
    {
      id: 7,
      title: "Before After Coffee",
      image: "/lovable-uploads/0b753bd8-b180-46ae-8883-2c3ce70a4fdb.png",
      texts: ["BEFORE COFFEE", "AFTER COFFEE"],
      type: 'preset'
    },
    {
      id: 8,
      title: "Dog Reactions",
      image: "/lovable-uploads/b784a742-bad3-4afe-85d1-7b0552429977.png",
      texts: ["threat of bad guys", "hooman needs help", "real perceived danger", "sound of food wrapper"],
      type: 'preset'
    },
    {
      id: 9,
      title: "Day vs Night Energy",
      image: "/lovable-uploads/2d361e59-4be5-43e2-8043-77bd78d04190.png",
      texts: ["ME ALL DAY", "ME AT 3 A.M."],
      type: 'preset'
    },
    {
      id: 10,
      title: "Parent Evolution",
      image: "/lovable-uploads/dfdef668-2fea-4a44-a954-ebecb83f554c.png",
      texts: ["NEW PARENT", "6 MONTHS IN", "1 YEAR LATER"],
      type: 'preset'
    }
  ];

  const mockupStyles = [
    { id: 'phone', name: 'Phone Mockup', style: 'phone' },
    { id: 'laptop', name: 'Laptop Screen', style: 'laptop' },
    { id: 'tablet', name: 'Tablet View', style: 'tablet' },
    { id: 'poster', name: 'Poster Frame', style: 'poster' },
    { id: 'social', name: 'Social Media', style: 'social' }
  ];

  const templateLayouts = [
    { id: 'single', name: 'Single Image', cols: 1, rows: 1 },
    { id: 'double', name: 'Two Images', cols: 2, rows: 1 },
    { id: 'triple', name: 'Three Images', cols: 3, rows: 1 },
    { id: 'quad', name: 'Four Images', cols: 2, rows: 2 },
    { id: 'grid', name: 'Six Images', cols: 3, rows: 2 }
  ];

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate({
      ...template,
      texts: [...template.texts]
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
    setSelectedImageToCrop(newImageUrl);
    setShowReplaceDialog(false);
    setShowCropDialog(true);
  };

  const handleCropComplete = () => {
    if (selectedTemplate && selectedImageToCrop) {
      setSelectedTemplate({
        ...selectedTemplate,
        image: selectedImageToCrop
      });
      setShowCropDialog(false);
      setSelectedImageToCrop("");
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

  const createCustomTemplate = (layout: string) => {
    const layoutConfig = templateLayouts.find(l => l.id === layout);
    if (!layoutConfig) return;

    const newTemplate: Template = {
      id: Date.now(),
      title: `Custom ${layoutConfig.name} Template`,
      image: '',
      texts: [],
      type: 'custom',
      layout: layout as any,
      elements: []
    };

    // Create empty image placeholders based on layout
    for (let i = 0; i < (layoutConfig.cols * layoutConfig.rows); i++) {
      const col = i % layoutConfig.cols;
      const row = Math.floor(i / layoutConfig.cols);
      newTemplate.elements?.push({
        id: i + 1,
        type: 'image',
        x: (col * 300) + 50,
        y: (row * 200) + 50,
        width: 250,
        height: 150,
        content: ''
      });
    }

    setSelectedTemplate(newTemplate);
    setCustomElements(newTemplate.elements || []);
    setActiveTab("editor");
  };

  const addTextElement = () => {
    const newElement: TemplateElement = {
      id: Date.now(),
      type: 'text',
      x: 100,
      y: 100,
      content: 'New Text',
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: 'bold'
    };
    setCustomElements(prev => [...prev, newElement]);
  };

  const addImageElement = () => {
    const newElement: TemplateElement = {
      id: Date.now(),
      type: 'image',
      x: 150,
      y: 150,
      width: 200,
      height: 150,
      content: ''
    };
    setCustomElements(prev => [...prev, newElement]);
  };

  const updateElement = (id: number, updates: Partial<TemplateElement>) => {
    setCustomElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: number) => {
    setSelectedElement(elementId);
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const element = customElements.find(el => el.id === elementId);
      if (element) {
        setDragOffset({
          x: e.clientX - rect.left - element.x,
          y: e.clientY - rect.top - element.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      updateElement(selectedElement, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDownload = async () => {
    if (!selectedTemplate) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        if (selectedTemplate.type === 'preset') {
          ctx.font = 'bold 40px Arial';
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.textAlign = 'center';

          selectedTemplate.texts.forEach((text, index) => {
            if (text) {
              const y = index === 0 ? 50 : canvas.height - 30;
              ctx.strokeText(text, canvas.width / 2, y);
              ctx.fillText(text, canvas.width / 2, y);
            }
          });
        } else {
          customElements.forEach(el => {
            if (el.type === 'text') {
              ctx.font = `${el.fontWeight || 'bold'} ${el.fontSize || 24}px Arial`;
              ctx.fillStyle = el.color || 'white';
              ctx.textAlign = 'left';
              ctx.fillText(el.content, el.x, el.y);
            } else if (el.type === 'image' && el.content) {
              const imageEl = new Image();
              imageEl.src = el.content;
              ctx.drawImage(imageEl, el.x, el.y, el.width || 100, el.height || 100);
            }
          });
        }

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

      <main className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="custom">Create Custom</TabsTrigger>
            <TabsTrigger value="mockups">Mockups</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Choose a Template
              </h1>
              <p className="text-gray-400">Select from our collection of popular meme templates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memeTemplates.map((template) => (
                <Card key={template.id} className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-colors cursor-pointer">
                  <CardContent className="p-4" onClick={() => handleTemplateSelect(template)}>
                    <img 
                      src={template.image} 
                      alt={template.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-white text-center">{template.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Create Custom Template
              </h1>
              <p className="text-gray-400">Choose a layout to start creating your own template</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templateLayouts.map((layout) => (
                <Card key={layout.id} className="bg-gray-800/50 border-gray-600 hover:border-green-400 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center" onClick={() => createCustomTemplate(layout.id)}>
                    <div className={`grid gap-2 mb-4 mx-auto w-fit`} style={{gridTemplateColumns: `repeat(${layout.cols}, 1fr)`}}>
                      {Array.from({ length: layout.cols * layout.rows }).map((_, i) => (
                        <div key={i} className="w-8 h-6 bg-gray-600 rounded"></div>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{layout.name}</h3>
                    <p className="text-sm text-gray-400">{layout.cols}x{layout.rows} layout</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mockups" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Mockup Styles
              </h1>
              <p className="text-gray-400">Apply different mockup styles to your templates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockupStyles.map((mockup) => (
                <Card key={mockup.id} className="bg-gray-800/50 border-gray-600 hover:border-yellow-400 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Square className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{mockup.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            {selectedTemplate ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Canvas Area */}
                <div className="lg:col-span-2">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Template Canvas</CardTitle>
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
                    <CardContent>
                      <div 
                        ref={canvasRef}
                        className="relative bg-white rounded-lg p-4 min-h-[400px] overflow-hidden"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        {selectedTemplate.type === 'preset' ? (
                          <>
                            <img 
                              src={selectedTemplate.image} 
                              alt="Template"
                              className="w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setShowReplaceDialog(true)}
                            />
                            {selectedTemplate.texts.map((text: string, index: number) => (
                              <div
                                key={index}
                                className={`absolute text-white font-bold text-lg text-center cursor-pointer px-2 py-1 rounded ${index === 0 ? 'top-4' : 'bottom-4'} left-1/2 transform -translate-x-1/2`}
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
                          </>
                        ) : (
                          <>
                            {customElements.map((element) => (
                              <div
                                key={element.id}
                                className={`absolute cursor-move border-2 ${selectedElement === element.id ? 'border-blue-400' : 'border-transparent'} rounded`}
                                style={{
                                  left: element.x,
                                  top: element.y,
                                  width: element.width,
                                  height: element.height
                                }}
                                onMouseDown={(e) => handleMouseDown(e, element.id)}
                              >
                                {element.type === 'image' ? (
                                  element.content ? (
                                    <img src={element.content} alt="Element" className="w-full h-full object-cover rounded" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                                      <Upload className="w-8 h-8" />
                                    </div>
                                  )
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center text-center font-bold"
                                    style={{
                                      fontSize: element.fontSize,
                                      color: element.color,
                                      fontWeight: element.fontWeight
                                    }}
                                  >
                                    {element.content}
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
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
                </div>

                {/* Controls Panel */}
                <div className="space-y-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Add Elements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        onClick={addTextElement}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Text
                      </Button>
                      <Button
                        onClick={addImageElement}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Image
                      </Button>
                    </CardContent>
                  </Card>

                  {selectedElement && (
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Element Properties</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(() => {
                          const element = customElements.find(el => el.id === selectedElement);
                          if (!element) return null;

                          return (
                            <>
                              {element.type === 'text' && (
                                <>
                                  <div>
                                    <label className="text-sm text-gray-400">Text Content</label>
                                    <Input
                                      value={element.content}
                                      onChange={(e) => updateElement(element.id, { content: e.target.value })}
                                      className="bg-gray-700 border-gray-600 text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Font Size</label>
                                    <Slider
                                      value={[element.fontSize || 24]}
                                      onValueChange={([value]) => updateElement(element.id, { fontSize: value })}
                                      max={72}
                                      min={12}
                                      step={2}
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Color</label>
                                    <Input
                                      type="color"
                                      value={element.color || '#FFFFFF'}
                                      onChange={(e) => updateElement(element.id, { color: e.target.value })}
                                      className="bg-gray-700 border-gray-600"
                                    />
                                  </div>
                                </>
                              )}
                              {element.type === 'image' && (
                                <>
                                  <div>
                                    <label className="text-sm text-gray-400">Width</label>
                                    <Slider
                                      value={[element.width || 200]}
                                      onValueChange={([value]) => updateElement(element.id, { width: value })}
                                      max={500}
                                      min={50}
                                      step={10}
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Height</label>
                                    <Slider
                                      value={[element.height || 150]}
                                      onValueChange={([value]) => updateElement(element.id, { height: value })}
                                      max={400}
                                      min={50}
                                      step={10}
                                      className="w-full"
                                    />
                                  </div>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          if (event.target?.result) {
                                            updateElement(element.id, { content: event.target.result as string });
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </>
                              )}
                              <Button
                                onClick={() => {
                                  setCustomElements(prev => prev.filter(el => el.id !== element.id));
                                  setSelectedElement(null);
                                }}
                                variant="destructive"
                                className="w-full"
                              >
                                Delete Element
                              </Button>
                            </>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-400 mb-4">No Template Selected</h2>
                <p className="text-gray-500">Choose a template or create a custom one to start editing</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Cropping Dialog */}
        <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Crop Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedImageToCrop && (
                <div className="text-center">
                  <img 
                    src={selectedImageToCrop} 
                    alt="Image to crop"
                    className="max-w-full max-h-96 mx-auto rounded-lg"
                  />
                  <p className="text-gray-400 mt-2">Image will be automatically fitted to template size</p>
                </div>
              )}
              <div className="flex space-x-2">
                <Button
                  onClick={handleCropComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply Crop
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCropDialog(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TemplateEditor;
