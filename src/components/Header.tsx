import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserProfile from "@/components/UserProfile";
import AuthModal from "@/components/AuthModal";
import HamburgerMenu from "@/components/HamburgerMenu";

const Header = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">MemeGen</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 border-blue-500/20">
                  AI Powered
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Auth & Menu */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <UserProfile />
                ) : (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                )}
              </>
            )}
            <HamburgerMenu />
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;