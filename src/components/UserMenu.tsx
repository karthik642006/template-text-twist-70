import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

const UserMenu = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Initial fetch of the current user
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) {
        setUser(data.user as SupabaseUser | null);
      }
    });

    // Listen to auth state changes so the UI reacts to login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as SupabaseUser) ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = () => {
    // Redirect to the dedicated auth page (assumes you have /login route)
    window.location.href = "/login";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <Button
        variant="secondary"
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handleSignIn}
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer border border-gray-600">
          <AvatarImage
            src={user.user_metadata?.avatar_url}
            alt={user.email ?? "User avatar"}
          />
          <AvatarFallback className="bg-gray-700 text-white">
            {user.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-gray-900 border-gray-700">
        <div className="px-3 py-2 text-xs text-gray-400">{user.email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => (window.location.href = "/profile")}
          className="cursor-pointer"
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-500 focus:text-red-500"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;