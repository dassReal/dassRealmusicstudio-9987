import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Music2, Image, Sparkles, Layers, Wand2, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";

export default function Home() {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
  });

  const isAuthenticated = session?.user;

  const features = [
    {
      icon: Video,
      title: "Music Video Studio",
      description: "Upload audio, extract vocals, remix instrumentals, and generate stunning visuals",
      href: "/video-studio",
      color: "text-blue-500",
    },
    {
      icon: Music2,
      title: "Song Builder",
      description: "Create songs from scratch with professional templates, structures, and melody sequences",
      href: "/song-builder",
      color: "text-purple-500",
    },
    {
      icon: Image,
      title: "Album Cover Designer",
      description: "Design beautiful album covers with AI-powered tools and customizable templates",
      href: "/album-cover",
      color: "text-pink-500",
    },
  ];

  const capabilities = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Advanced AI technology to generate videos, remix audio, and create stunning visuals",
    },
    {
      icon: Layers,
      title: "Professional Templates",
      description: "Access song structures, melody patterns, scales, and percussion transitions",
    },
    {
      icon: Wand2,
      title: "Audio Processing",
      description: "Extract vocals, isolate instrumentals, and remix tracks with precision",
    },
    {
      icon: Users,
      title: "Community Gallery",
      description: "Share your creations and discover work from creators worldwide",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        
        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create. Mix. Visualize. Share.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate music video studio for creators. Generate stunning music videos, remix instrumentals, 
              build songs from scratch, and design album covers—all in one place.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button size="lg" asChild>
                    <Link to="/video-studio">
                      <Video className="h-5 w-5 mr-2" />
                      Start Creating
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/gallery">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Explore Gallery
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/sign-up">Get Started Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/gallery">View Gallery</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Creative Powerhouse</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to bring your musical vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className={`mb-4 ${feature.color}`}>
                    <feature.icon className="h-12 w-12" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to={feature.href}>Launch Studio</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Professional Tools, Simple Interface
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Built for creators of all skill levels. Whether you're a seasoned producer or just starting out, 
                our intuitive tools help you create professional-quality content in minutes.
              </p>
              
              <div className="space-y-6">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <capability.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{capability.title}</h3>
                      <p className="text-sm text-muted-foreground">{capability.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="/studio-interface-TA7ok.png"
                alt="Studio Interface"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1">
              <img
                src="/video-editor-_2QfS.png"
                alt="Video Editor"
                className="rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Share Your Creations
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join a vibrant community of creators. Share your music videos, songs, and album covers with the world. 
                Get feedback, collaborate, and discover inspiration from fellow artists.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="font-medium">Upload unlimited projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="font-medium">Build your portfolio</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="font-medium">Collaborate with others</span>
                </div>
              </div>

              <Button size="lg" className="mt-8" asChild>
                <Link to="/gallery">
                  <Users className="h-5 w-5 mr-2" />
                  Explore Gallery
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Create Your Masterpiece?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators using SoundWave Studio to bring their musical vision to life
            </p>
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link to="/video-studio">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Open Studio
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/sign-up">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
