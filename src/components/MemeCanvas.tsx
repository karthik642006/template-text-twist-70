
import { forwardRef } from "react";
import { TextField, ImageField } from "@/types/meme";

interface MemeCanvasProps {
  templateImage: string;
  imageStyle: string;
  textFields: TextField[];
  imageFields: ImageField[];
  selectedTextId: number;
  selectedImageId: number | null;
  onMouseDown: (e: React.MouseEvent, elementId: number, elementType: 'text' | 'image') => void;
  onTouchStart: (e: React.TouchEvent, elementId: number, elementType: 'text' | 'image') => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const MemeCanvas = forwardRef<HTMLDivElement, MemeCanvasProps>(({
  templateImage,
  imageStyle,
  textFields,
  imageFields,
  selectedTextId,
  selectedImageId,
  onMouseDown,
  onTouchStart,
  onMouseMove,
  onMouseUp,
  onTouchMove,
  onTouchEnd
}, ref) => {
  const calculateHorizontalPosition = (text: string) => {
    const leadingSpaces = text.match(/^ */)?.[0].length || 0;
    return Math.min(leadingSpaces * 5, 50);
  };

  const headerText = textFields.find(field => field.type === 'header');
  const footerText = textFields.find(field => field.type === 'footer');
  const regularTextFields = textFields.filter(field => field.type === 'text');

  return (
    <div className="relative max-w-sm sm:max-w-md w-full">
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
          onMouseDown={e => onMouseDown(e, headerText.id, 'text')} 
          onTouchStart={e => onTouchStart(e, headerText.id, 'text')}
        >
          {headerText.text}
        </div>
      )}

      {/* Template Image Container */}
      <div 
        ref={ref} 
        className="relative bg-white rounded-lg shadow-lg overflow-hidden select-none" 
        data-meme-container
        onMouseMove={onMouseMove} 
        onMouseUp={onMouseUp} 
        onMouseLeave={onMouseUp} 
        onTouchMove={onTouchMove} 
        onTouchEnd={onTouchEnd}
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
            onMouseDown={e => onMouseDown(e, field.id, 'text')} 
            onTouchStart={e => onTouchStart(e, field.id, 'text')}
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
            onMouseDown={e => onMouseDown(e, field.id, 'image')} 
            onTouchStart={e => onTouchStart(e, field.id, 'image')}
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
          onMouseDown={e => onMouseDown(e, footerText.id, 'text')} 
          onTouchStart={e => onTouchStart(e, footerText.id, 'text')}
        >
          {footerText.text}
        </div>
      )}
    </div>
  );
});

MemeCanvas.displayName = "MemeCanvas";

export default MemeCanvas;
