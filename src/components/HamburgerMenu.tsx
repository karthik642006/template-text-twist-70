
import { useState } from "react";
import { Menu, User, Settings, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Meme Editor", path: "/editor/blank" },
    { title: "Template Editor", path: "/template-editor" },
    { title: "Image to GIF", path: "/image-to-gif" },
    { title: "Video Editor", path: "/video-editor" },
    { title: "About Us", path: "/about" },
    { title: "Pricing", path: "/pricing" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-gray-900 border-gray-700">
        <div className="flex flex-col space-y-4 mt-8">
          {/* User Profile Section (if logged in) */}
          {user && (
            <>
              <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-white font-medium">{displayName}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-yellow-400 font-medium">Pro Member</span>
                  </div>
                </div>
              </div>
              
              {/* User-specific menu items */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-700 h-12 text-lg"
                  onClick={() => handleNavigation('/profile')}
                >
                  <User className="mr-3 h-5 w-5" />
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-700 h-12 text-lg"
                  onClick={() => handleNavigation('/my-memes')}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  My Memes
                </Button>
              </div>
              
              <Separator className="bg-gray-700" />
            </>
          )}

          {/* Regular menu items */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Navigation</h2>
          </div>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="justify-start text-white hover:bg-gray-700 h-12 text-lg"
              onClick={() => handleNavigation(item.path)}
            >
              {item.title}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
