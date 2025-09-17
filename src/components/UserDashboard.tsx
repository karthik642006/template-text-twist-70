import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image, 
  Calendar, 
  Download, 
  Share2, 
  Trash2, 
  Plus,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();
  const [recentMemes, setRecentMemes] = useState([]);
  const [stats, setStats] = useState({
    totalMemes: 12,
    totalViews: 1247,
    totalShares: 89,
    thisWeek: 3
  });

  // Mock data for demonstration
  const mockMemes = [
    {
      id: 1,
      title: "Distracted Boyfriend Meme",
      image: "https://i.imgflip.com/1ur9b0.jpg",
      createdAt: "2024-01-15",
      views: 234,
      shares: 12,
      status: "published"
    },
    {
      id: 2,
      title: "Drake Pointing Meme",
      image: "https://i.imgflip.com/30b1gx.jpg",
      createdAt: "2024-01-14",
      views: 189,
      shares: 8,
      status: "published"
    },
    {
      id: 3,
      title: "Woman Yelling at Cat",
      image: "https://i.imgflip.com/345v97.jpg",
      createdAt: "2024-01-13",
      views: 456,
      shares: 23,
      status: "published"
    },
    {
      id: 4,
      title: "Two Buttons Meme",
      image: "https://i.imgflip.com/1g8my4.jpg",
      createdAt: "2024-01-12",
      views: 123,
      shares: 5,
      status: "draft"
    }
  ];

  useEffect(() => {
    // In a real app, fetch user's memes from the backend
    setRecentMemes(mockMemes);
  }, []);

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}! 👋
            </h2>
            <p className="text-gray-300">
              Ready to create some amazing memes today?
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Create New Meme
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Memes</p>
                <p className="text-2xl font-bold text-white">{stats.totalMemes}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Image className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Shares</p>
                <p className="text-2xl font-bold text-white">{stats.totalShares}</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Memes */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Your Recent Memes</span>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {recentMemes.length} memes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700/50">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-blue-600">
                All
              </TabsTrigger>
              <TabsTrigger value="published" className="text-white data-[state=active]:bg-blue-600">
                Published
              </TabsTrigger>
              <TabsTrigger value="drafts" className="text-white data-[state=active]:bg-blue-600">
                Drafts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMemes.map((meme) => (
                  <Card key={meme.id} className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-600 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={meme.image} 
                          alt={meme.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white text-sm truncate">{meme.title}</h4>
                          <Badge 
                            variant={meme.status === 'published' ? 'default' : 'secondary'}
                            className={meme.status === 'published' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }
                          >
                            {meme.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(meme.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{meme.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="h-8 px-2 text-gray-400 hover:text-white">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 px-2 text-gray-400 hover:text-white">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="published">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMemes.filter(meme => meme.status === 'published').map((meme) => (
                  <Card key={meme.id} className="bg-gray-700/30 border-gray-600">
                    {/* Same card content as above */}
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-600 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={meme.image} 
                          alt={meme.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-white text-sm">{meme.title}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="drafts">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMemes.filter(meme => meme.status === 'draft').map((meme) => (
                  <Card key={meme.id} className="bg-gray-700/30 border-gray-600">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-600 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={meme.image} 
                          alt={meme.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-white text-sm">{meme.title}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;