
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DownloadComponent = () => {
  const { toast } = useToast();

  const handleDownloadClick = async () => {
    console.log("Download component clicked");
    
    try {
      // Find the meme container with the template image
      const memeContainer = document.querySelector('[data-meme-container]') || 
                           document.querySelector('img[alt="Meme template"]')?.parentElement;
      
      if (!memeContainer) {
        toast({
          title: "Download failed",
          description: "Could not find meme to download",
          variant: "destructive"
        });
        return;
      }

      // Create canvas to render the meme
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Get the template image
      const templateImg = memeContainer.querySelector('img[alt="Meme template"]') as HTMLImageElement;
      if (!templateImg) return;

      // Set canvas size to match image
      canvas.width = templateImg.naturalWidth || templateImg.width;
      canvas.height = templateImg.naturalHeight || templateImg.height;

      // Draw the template image
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      // Get all text elements and draw them on canvas
      const textElements = memeContainer.querySelectorAll('[style*="position: absolute"]');
      textElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const text = htmlElement.textContent || '';
        const computedStyle = window.getComputedStyle(htmlElement);
        
        if (text.trim()) {
          const fontSize = parseInt(computedStyle.fontSize) || 32;
          const fontFamily = computedStyle.fontFamily || 'Arial';
          const color = computedStyle.color || '#FFFFFF';
          const fontWeight = computedStyle.fontWeight || 'bold';
          
          // Calculate position relative to canvas
          const rect = htmlElement.getBoundingClientRect();
          const containerRect = memeContainer.getBoundingClientRect();
          const x = (rect.left - containerRect.left) * (canvas.width / containerRect.width);
          const y = (rect.top - containerRect.top) * (canvas.height / containerRect.height);
          
          ctx.font = `${fontWeight} ${fontSize * 2}px ${fontFamily}`;
          ctx.fillStyle = color;
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.textAlign = 'center';
          
          // Draw text with stroke (outline)
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
        }
      });

      // Convert canvas to blob and download
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

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Unable to download meme. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 text-xs px-2 h-8" 
      onClick={handleDownloadClick}
    >
      <Download className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">DL</span>
      <span className="sm:hidden">DL</span>
    </Button>
  );
};

export default DownloadComponent;
