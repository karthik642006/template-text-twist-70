
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadComponentProps {
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
}

const UploadComponent = ({ onImageSelect }: UploadComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageSelect(event.target.result as string, 'upload');
        setIsOpen(false);
        setIsUploading(false);
        toast({
          title: "Upload successful!",
          description: "Your image has been added to the meme editor."
        });
      }
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to read the image file. Please try again.",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 text-xs px-2 h-8"
        >
          <Upload className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Up</span>
          <span className="sm:hidden">Up</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-500" />
            Upload Image or Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Image</h3>
            <p className="text-gray-600 mb-4">Add your own images, memes, or templates to edit</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
              id="upload-input"
              disabled={isUploading}
            />
            <label htmlFor="upload-input">
              <Button 
                className="cursor-pointer bg-orange-600 hover:bg-orange-700"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
            </label>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Supported formats: JPG, PNG, GIF • Max size: 10MB
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadComponent;
