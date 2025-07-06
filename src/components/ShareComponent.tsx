
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";

const ShareComponent = () => {
  const handleShareClick = () => {
    console.log("Share component clicked");
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
