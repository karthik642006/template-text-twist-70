// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

const getInitials = (nameOrEmail: string | null): string => {
  if (!nameOrEmail) return "U";
  const trimmed = nameOrEmail.trim();
  if (trimmed.includes(" ")) {
    const parts = trimmed.split(" ").filter(Boolean);
    return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
  }
  return trimmed[0]?.toUpperCase() ?? "U";
};

const UserProfileMenu = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user ?? null;
        if (!isMounted) return;
        if (user) {
          setProfile({
            id: user.id,
            email: user.email ?? null,
            name: (user.user_metadata as any)?.name ?? (user.user_metadata as any)?.full_name ?? null,
            avatarUrl: (user.user_metadata as any)?.avatar_url ?? null,
          });
        } else {
          setProfile(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        setProfile({
          id: user.id,
          email: user.email ?? null,
          name: (user.user_metadata as any)?.name ?? (user.user_metadata as any)?.full_name ?? null,
          avatarUrl: (user.user_metadata as any)?.avatar_url ?? null,
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        Loading...
      </Button>
    );
  }

  if (!profile) {
    return (
      <Button onClick={handleSignIn} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
        Sign in
      </Button>
    );
  }

  const displayName = profile.name || profile.email || "User";
  const initials = getInitials(profile.name || profile.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5 border border-white/10">
          <Avatar className="h-8 w-8">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm text-white/90 max-w-[140px] truncate">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {profile.avatarUrl ? (
                <AvatarImage src={profile.avatarUrl} alt={displayName} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{displayName}</span>
              {profile.email && (
                <span className="text-xs text-muted-foreground">{profile.email}</span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.assign("/template-editor")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.assign("/pricing")}>Upgrade</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;

