import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

type SupabaseUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> & {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
};

const initialsFromName = (name?: string | null) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "U";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
};

const UserProfileMenu = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser((data?.user as unknown as SupabaseUser) ?? null);
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as unknown as SupabaseUser) ?? null);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    // Default to GitHub OAuth; adjust as needed
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const displayName =
    (user?.user_metadata?.name as string) ||
    (user?.user_metadata?.full_name as string) ||
    user?.email ||
    "User";

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button size="sm" variant="secondary" onClick={handleSignIn} className="bg-white/10 hover:bg-white/20 text-white">
        <LogIn className="mr-2 h-4 w-4" /> Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/10 focus:outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={(user.user_metadata?.avatar_url as string) || ""} />
            <AvatarFallback>{initialsFromName(displayName)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm text-white/90">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="truncate">{displayName}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a href="/template-editor">Create template</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/pricing">Upgrade</a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;

