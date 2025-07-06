
import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { TextField, ImageField } from "@/types/meme";

interface ElementControlsProps {
  selectedText: TextField | undefined;
  selectedImage: ImageField | undefined;
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
}

const ElementControls = ({ selectedText, selectedImage, onRotate, onScaleUp, onScaleDown }: ElementControlsProps) => {
  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-800">Element Controls</h4>
      <div className="flex items-center justify-center space-x-4">
        <Button 
          onClick={onRotate} 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2 px-4 py-2"
        >
          <RotateCw className="w-4 h-4" />
          <span>Rotate</span>
        </Button>
        <Button 
          onClick={onScaleUp} 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2 px-4 py-2"
        >
          <ZoomIn className="w-4 h-4" />
          <span>Scale +</span>
        </Button>
        <Button 
          onClick={onScaleDown} 
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
  );
};

export default ElementControls;
