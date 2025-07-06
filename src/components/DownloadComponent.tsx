import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
const DownloadComponent = () => {
  const handleDownloadClick = () => {
    console.log("Download component clicked");
  };
  return <Button variant="outline" size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 text-xs px-2 h-8" onClick={handleDownloadClick}>
      <Download className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline"></span>
      <span className="sm:hidden">DL</span>
    </Button>;
};
export default DownloadComponent;