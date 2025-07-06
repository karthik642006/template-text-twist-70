import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Upload, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import EmojiSelector from "./EmojiSelector";
import StyleComponent from "./StyleComponent";
import ShareComponent from "./ShareComponent";
import DownloadComponent from "./DownloadComponent";
import ImageGenerator from "./ImageGenerator";
import UploadComponent from "./UploadComponent";
import AddImageComponent from "./AddImageComponent";

interface TextField {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily: string;
  opacity: number;
  rotation: number;
  scale: number;
  type: 'text' | 'header' | 'footer';
}

interface ImageField {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  scale: number;
}

const MemeEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<number | null>(null);
  const [draggedElementType, setDraggedElementType] = useState<'text' | 'image' | null>(null);
  const [imageStyle, setImageStyle] = useState<string>("");
  const [selectedElementTimeout, setSelectedElementTimeout] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [textFields, setTextFields] = useState<TextField[]>([
    {
      id: 1,
      text: "Top text",
      x: 50,
      y: 10,
      fontSize: 32,
      color: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: "Arial",
      opacity: 100,
      rotation: 0,
      scale: 1,
      type: 'header'
    },
    {
      id: 2,
      text: "Bottom text",
      x: 50,
      y: 90,
      fontSize: 32,
      color: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: "Arial",
      opacity: 100,
      rotation: 0,
      scale: 1,
      type: 'footer'
    }
  ]);

  const [imageFields, setImageFields] = useState<ImageField[]>([]);
  const [selectedTextId, setSelectedTextId] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [templateImage, setTemplateImage] = useState("https://i.imgflip.com/1ur9b0.jpg");
  const [showImageDialog, setShowImageDialog] = useState(false);

  const selectedText = textFields.find(field => field.id === selectedTextId);
  const selectedImage = imageFields.find(field => field.id === selectedImageId);
  const fontFamilies = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", "Comic Sans MS"];
  const fontWeights = ["normal", "bold", "bolder", "lighter"];

  // Auto-hide selection after 3 seconds
  useEffect(() => {
    if (selectedTextId || selectedImageId) {
      if (selectedElementTimeout) {
        clearTimeout(selectedElementTimeout);
      }
      const timeout = setTimeout(() => {
        setSelectedTextId(0);
        setSelectedImageId(null);
      }, 3000);
      setSelectedElementTimeout(timeout);
    }
    return () => {
      if (selectedElementTimeout) {
        clearTimeout(selectedElementTimeout);
      }
    };
  }, [selectedTextId, selectedImageId]);

  // Load template from localStorage or URL param
  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setTemplateImage(savedTemplate);
      localStorage.removeItem('selectedTemplate');
    }
  }, []);

  // Helper function to calculate horizontal position based on leading spaces in text
  const calculateHorizontalPosition = (text: string) => {
    const leadingSpaces = text.match(/^ */)?.[0].length || 0;
    return Math.min(leadingSpaces * 5, 50);
  };

  const updateTextField = (id: number, updates: Partial<TextField>) => {
    setTextFields(prev => prev.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const updateImageField = (id: number, updates: Partial<ImageField>) => {
    setImageFields(prev => prev.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const addTextField = (type: 'text' | 'header' | 'footer' = 'text') => {
    if (type === 'header' && textFields.some(field => field.type === 'header')) {
      return;
    }
    if (type === 'footer' && textFields.some(field => field.type === 'footer')) {
      return;
    }
    const newId = Math.max(...textFields.map(f => f.id), 0) + 1;
    let yPosition = 50;
    let xPosition = 50;
    if (type === 'header') {
      yPosition = 10;
    } else if (type === 'footer') {
      yPosition = 90;
    }
    setTextFields([...textFields, {
      id: newId,
      text: type === 'header' ? "Header text" : type === 'footer' ? "Footer text" : "New text",
      x: xPosition,
      y: yPosition,
      fontSize: 32,
      color: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: "Arial",
      opacity: 100,
      rotation: 0,
      scale: 1,
      type
    }]);
    setSelectedTextId(newId);
  };

  const removeTextField = (id: number) => {
    if (textFields.length > 1) {
      setTextFields(prev => prev.filter(field => field.id !== id));
      if (selectedTextId === id) {
        const remaining = textFields.filter(field => field.id !== id);
        setSelectedTextId(remaining[0]?.id || 0);
      }
    }
  };

  const removeImageField = (id: number) => {
    setImageFields(prev => prev.filter(field => field.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  const handleImageSelect = (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => {
    const newId = Math.max(...imageFields.map(f => f.id), 0) + 1;
    setImageFields([...imageFields, {
      id: newId,
      src,
      x: 50,
      y: 50,
      width: type === 'emoji' ? 60 : 100,
      height: type === 'emoji' ? 60 : 100,
      opacity: 100,
      rotation: 0,
      scale: 1
    }]);
    setSelectedImageId(newId);
  };

  const handleStyleApply = (style: string) => {
    setImageStyle(style);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: number, elementType: 'text' | 'image') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDraggedElementId(elementId);
    setDraggedElementType(elementType);
    if (elementType === 'text') {
      setSelectedTextId(elementId);
      setSelectedImageId(null);
    } else {
      setSelectedImageId(elementId);
      setSelectedTextId(0);
    }
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const elementRect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - elementRect.left - elementRect.width / 2,
        y: e.clientY - elementRect.top - elementRect.height / 2
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent, elementId: number, elementType: 'text' | 'image') => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    setDraggedElementId(elementId);
    setDraggedElementType(elementType);
    if (elementType === 'text') {
      setSelectedTextId(elementId);
      setSelectedImageId(null);
    } else {
      setSelectedImageId(elementId);
      setSelectedTextId(0);
    }
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const elementRect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - elementRect.left - elementRect.width / 2,
        y: touch.clientY - elementRect.top - elementRect.height / 2
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedElementId || !draggedElementType) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const x = (e.clientX - containerRect.left - dragOffset.x) / containerRect.width * 100;
    const y = (e.clientY - containerRect.top - dragOffset.y) / containerRect.height * 100;
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    if (draggedElementType === 'text') {
      updateTextField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    } else {
      updateImageField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggedElementId || !draggedElementType) return;
    e.preventDefault();
    const touch = e.touches[0];
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const x = (touch.clientX - containerRect.left - dragOffset.x) / containerRect.width * 100;
    const y = (touch.clientY - containerRect.top - dragOffset.y) / containerRect.height * 100;
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    if (draggedElementType === 'text') {
      updateTextField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    } else {
      updateImageField(draggedElementId, {
        x: boundedX,
        y: boundedY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedElementId(null);
    setDraggedElementType(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDraggedElementId(null);
    setDraggedElementType(null);
  };

  const rotateElement = () => {
    if (selectedText) {
      updateTextField(selectedText.id, {
        rotation: (selectedText.rotation + 15) % 360
      });
    } else if (selectedImage) {
      updateImageField(selectedImage.id, {
        rotation: (selectedImage.rotation + 15) % 360
      });
    }
  };

  const scaleElementUp = () => {
    if (selectedText) {
      updateTextField(selectedText.id, {
        scale: Math.min(selectedText.scale + 0.1, 3)
      });
    } else if (selectedImage) {
      updateImageField(selectedImage.id, {
        scale: Math.min(selectedImage.scale + 0.1, 3)
      });
    }
  };

  const scaleElementDown = () => {
    if (selectedText) {
      updateTextField(selectedText.id, {
        scale: Math.max(selectedText.scale - 0.1, 0.3)
      });
    } else if (selectedImage) {
      updateImageField(selectedImage.id, {
        scale: Math.max(selectedImage.scale - 0.1, 0.3)
      });
    }
  };

  // Get header and footer texts
  const headerText = textFields.find(field => field.type === 'header');
  const footerText = textFields.find(field => field.type === 'footer');
  const regularTextFields = textFields.filter(field => field.type === 'text');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
            ← Back
          </Button>
          <span className="text-xl font-bold text-gray-800">Meme Editor</span>
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
        </div>
      </header>

      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Meme Preview - Top Half */}
        <div className="flex-1 p-2 sm:p-4 flex items-center justify-center bg-gray-50">
          <div className="relative max-w-sm sm:max-w-md w-full">
            {/* Action Components Row with proper spacing */}
            <div className="mb-4 flex gap-2 justify-center">
              <ImageGenerator onImageGenerated={setTemplateImage} />
              <UploadComponent onImageSelect={handleImageSelect} />
              <EmojiSelector onEmojiSelect={(emoji) => handleImageSelect(emoji, 'emoji')} />
              <StyleComponent onStyleApply={handleStyleApply} />
              <AddImageComponent onImageSelect={handleImageSelect} />
              <ShareComponent />
              <DownloadComponent />
            </div>

            {/* Header Text */}
            {headerText && headerText.text && (
              <div 
                className={`relative cursor-move select-none font-bold transition-all duration-300 ${selectedTextId === headerText.id ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 bg-opacity-20' : ''}`}
                style={{
                  marginLeft: `${calculateHorizontalPosition(headerText.text)}%`,
                  fontSize: `${headerText.fontSize * 0.4}px`,
                  color: headerText.color,
                  fontFamily: headerText.fontFamily,
                  fontWeight: headerText.fontWeight,
                  opacity: headerText.opacity / 100,
                  transform: `rotate(${headerText.rotation}deg) scale(${headerText.scale})`,
                  textShadow: '3px 3px 0px #000000, -3px -3px 0px #000000, 3px -3px 0px #000000, -3px 3px 0px #000000, 0px 3px 0px #000000, 3px 0px 0px #000000, 0px -3px 0px #000000, -3px 0px 0px #000000',
                  userSelect: 'none',
                  touchAction: 'none',
                  zIndex: selectedTextId === headerText.id ? 10 : 1,
                  whiteSpace: 'pre',
                  WebkitTextStroke: '1px #000000'
                }}
                onMouseDown={e => handleMouseDown(e, headerText.id, 'text')} 
                onTouchStart={e => handleTouchStart(e, headerText.id, 'text')}
              >
                {headerText.text}
              </div>
            )}

            {/* Template Image Container */}
            <div 
              ref={containerRef} 
              className="relative bg-white rounded-lg shadow-lg overflow-hidden select-none" 
              onMouseMove={handleMouseMove} 
              onMouseUp={handleMouseUp} 
              onMouseLeave={handleMouseUp} 
              onTouchMove={handleTouchMove} 
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={templateImage} 
                alt="Meme template" 
                className="w-full block" 
                draggable={false}
                style={{ filter: imageStyle }}
              />
              
              {/* Regular Text Fields */}
              {regularTextFields.map(field => (
                <div
                  key={field.id}
                  className={`absolute cursor-move select-none font-bold text-center px-2 py-1 transition-all duration-300 ${selectedTextId === field.id ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 bg-opacity-20' : ''}`}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    fontSize: `${field.fontSize * 0.4}px`,
                    color: field.color,
                    fontFamily: field.fontFamily,
                    fontWeight: field.fontWeight,
                    opacity: field.opacity / 100,
                    transform: `translate(-50%, -50%) rotate(${field.rotation}deg) scale(${field.scale})`,
                    textShadow: '3px 3px 0px #000000, -3px -3px 0px #000000, 3px -3px 0px #000000, -3px 3px 0px #000000, 0px 3px 0px #000000, 3px 0px 0px #000000, 0px -3px 0px #000000, -3px 0px 0px #000000',
                    minWidth: '60px',
                    userSelect: 'none',
                    touchAction: 'none',
                    zIndex: selectedTextId === field.id ? 10 : 1,
                    whiteSpace: 'pre',
                    WebkitTextStroke: '1px #000000'
                  }}
                  onMouseDown={e => handleMouseDown(e, field.id, 'text')} 
                  onTouchStart={e => handleTouchStart(e, field.id, 'text')}
                >
                  {field.text || "Place your text here"}
                </div>
              ))}
              
              {/* Image Fields */}
              {imageFields.map(field => (
                <div
                  key={field.id}
                  className={`absolute cursor-move transition-all duration-300 ${selectedImageId === field.id ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    width: `${field.width * field.scale}px`,
                    height: `${field.height * field.scale}px`,
                    opacity: field.opacity / 100,
                    transform: `translate(-50%, -50%) rotate(${field.rotation}deg)`,
                    touchAction: 'none',
                    zIndex: selectedImageId === field.id ? 10 : 1
                  }}
                  onMouseDown={e => handleMouseDown(e, field.id, 'image')} 
                  onTouchStart={e => handleTouchStart(e, field.id, 'image')}
                >
                  <img src={field.src} alt="Uploaded" className="w-full h-full object-cover rounded" draggable={false} />
                </div>
              ))}
            </div>

            {/* Footer Text */}
            {footerText && footerText.text && (
              <div 
                className={`relative cursor-move select-none font-bold transition-all duration-300 ${selectedTextId === footerText.id ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 bg-opacity-20' : ''}`}
                style={{
                  marginLeft: `${calculateHorizontalPosition(footerText.text)}%`,
                  fontSize: `${footerText.fontSize * 0.4}px`,
                  color: footerText.color,
                  fontFamily: footerText.fontFamily,
                  fontWeight: footerText.fontWeight,
                  opacity: footerText.opacity / 100,
                  transform: `rotate(${footerText.rotation}deg) scale(${footerText.scale})`,
                  textShadow: '3px 3px 0px #000000, -3px -3px 0px #000000, 3px -3px 0px #000000, -3px 3px 0px #000000, 0px 3px 0px #000000, 3px 0px 0px #000000, 0px -3px 0px #000000, -3px 0px 0px #000000',
                  userSelect: 'none',
                  touchAction: 'none',
                  zIndex: selectedTextId === footerText.id ? 10 : 1,
                  whiteSpace: 'pre',
                  WebkitTextStroke: '1px #000000'
                }}
                onMouseDown={e => handleMouseDown(e, footerText.id, 'text')} 
                onTouchStart={e => handleTouchStart(e, footerText.id, 'text')}
              >
                {footerText.text}
              </div>
            )}
          </div>
        </div>

        {/* Editor Controls - Bottom Half with proper scrolling */}
        <div className="flex-1 bg-white border-t border-gray-200" style={{ overflowY: 'auto', maxHeight: '50vh' }}>
          <div className="p-2 sm:p-4 space-y-4">
            {/* Combined Element Controls Section */}
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800">Element Controls</h4>
              <div className="flex items-center justify-center space-x-4">
                <Button 
                  onClick={rotateElement} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Rotate</span>
                </Button>
                <Button 
                  onClick={scaleElementUp} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>Scale +</span>
                </Button>
                <Button 
                  onClick={scaleElementDown} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <ZoomOut className="w-4 h-4" />
                  <span>Scale -</span>
                </Button>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {selectedText ? `Selected: Text Element` : selectedImage ? `Selected: Image Element` : 'Select an element to transform it'}
              </p>
            </div>

            {/* Text Field Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Text Elements</h3>
              {textFields.map(field => (
                <Card key={field.id} className={`border-gray-200 cursor-pointer transition-colors ${selectedTextId === field.id ? 'ring-2 ring-blue-400' : ''}`} onClick={() => {
                  setSelectedTextId(field.id);
                  setSelectedImageId(null);
                }}>
                  <CardContent className="p-3 py-0 px-[12px]">
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder={field.type === 'header' ? "Enter header text" : field.type === 'footer' ? "Enter footer text" : "Enter text"} 
                        value={field.text} 
                        onChange={e => updateTextField(field.id, { text: e.target.value })} 
                        className="flex-1 border-gray-300" 
                      />
                      {/* Color Picker */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="w-6 h-6 rounded cursor-pointer border border-gray-300" style={{ backgroundColor: field.color }} />
                        </PopoverTrigger>
                        <PopoverContent className="w-48 bg-white">
                          <div className="space-y-2">
                            <div className="grid grid-cols-6 gap-2">
                              {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'].map(color => (
                                <button key={color} className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: color }} onClick={() => updateTextField(field.id, { color })} />
                              ))}
                            </div>
                            <Input type="color" value={field.color} onChange={e => updateTextField(field.id, { color: e.target.value })} className="w-full h-8" />
                          </div>
                        </PopoverContent>
                      </Popover>
                      {/* Font Controls */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400">
                            Aa
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-white">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-600 block mb-2">Font Size</label>
                              <Slider value={[field.fontSize]} onValueChange={([value]) => updateTextField(field.id, { fontSize: value })} max={72} min={12} step={2} className="w-full" />
                              <span className="text-xs text-gray-500">{field.fontSize}px</span>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 block mb-2">Font Family</label>
                              <select value={field.fontFamily} onChange={e => updateTextField(field.id, { fontFamily: e.target.value })} className="w-full p-2 border border-gray-300 rounded">
                                {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 block mb-2">Font Weight</label>
                              <select value={field.fontWeight} onChange={e => updateTextField(field.id, { fontWeight: e.target.value })} className="w-full p-2 border border-gray-300 rounded">
                                {fontWeights.map(weight => <option key={weight} value={weight}>{weight}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 block mb-2">Opacity</label>
                              <Slider value={[field.opacity]} onValueChange={([value]) => updateTextField(field.id, { opacity: value })} max={100} min={0} step={5} className="w-full" />
                              <span className="text-xs text-gray-500">{field.opacity}%</span>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button variant="ghost" size="sm" onClick={e => {
                        e.stopPropagation();
                        removeTextField(field.id);
                      }} className="text-gray-400 hover:text-red-500">
                        ×
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Image Elements */}
            {imageFields.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Image Elements</h3>
                {imageFields.map(field => (
                  <Card key={field.id} className={`border-gray-200 cursor-pointer transition-colors ${selectedImageId === field.id ? 'ring-2 ring-blue-400' : ''}`} onClick={() => {
                    setSelectedImageId(field.id);
                    setSelectedTextId(0);
                  }}>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <img src={field.src} alt="Uploaded" className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-600">Image {field.id}</div>
                          <div className="text-xs text-gray-400">Opacity: {field.opacity}%</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500">Opacity</div>
                          <Slider 
                            value={[field.opacity]} 
                            onValueChange={([value]) => updateImageField(field.id, { opacity: value })} 
                            max={100} 
                            min={0} 
                            step={5} 
                            className="w-16" 
                          />
                        </div>
                        <Button variant="ghost" size="sm" onClick={e => {
                          e.stopPropagation();
                          removeImageField(field.id);
                        }} className="text-gray-400 hover:text-red-500">
                          ×
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add New Elements */}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => addTextField('text')} className="bg-blue-600 hover:bg-blue-700 text-white">
                + New text
              </Button>
              <Button onClick={() => addTextField('header')} variant="outline" className="border-purple-300 text-purple-700" disabled={textFields.some(field => field.type === 'header')}>
                + Header
              </Button>
              <Button onClick={() => addTextField('footer')} variant="outline" className="border-purple-300 text-purple-700" disabled={textFields.some(field => field.type === 'footer')}>
                + Footer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeEditor;
