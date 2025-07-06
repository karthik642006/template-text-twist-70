
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShareComponent = () => {
  const { toast } = useToast();

  const handleShareClick = async () => {
    console.log("Share component clicked");
    
    try {
      // Check if Web Share API is supported
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
        // Fallback: Copy URL to clipboard
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
    <Button 
      variant="outline" 
      size="sm"
      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none hover:from-green-600 hover:to-emerald-600 text-xs px-2 h-8"
      onClick={handleShareClick}
    >
      <Share className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">Share</span>
      <span className="sm:hidden">Shr</span>
    </Button>
  );
};

export default ShareComponent;
