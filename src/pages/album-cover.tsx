import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Save, Download, Wand2, Palette } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const artStyles = [
  { id: "minimalist", name: "Minimalist", description: "Clean, simple, modern" },
  { id: "abstract", name: "Abstract", description: "Bold shapes and colors" },
  { id: "vintage", name: "Vintage", description: "Retro, nostalgic vibes" },
  { id: "cyberpunk", name: "Cyberpunk", description: "Neon, futuristic, edgy" },
  { id: "grunge", name: "Grunge", description: "Rough, textured, raw" },
  { id: "psychedelic", name: "Psychedelic", description: "Trippy, vibrant, surreal" },
];

const colorSchemes = [
  { id: "monochrome", name: "Monochrome", colors: ["#000000", "#FFFFFF"] },
  { id: "sunset", name: "Sunset", colors: ["#FF6B6B", "#FFA07A", "#FFD93D"] },
  { id: "ocean", name: "Ocean", colors: ["#1E3A8A", "#3B82F6", "#38BDF8"] },
  { id: "forest", name: "Forest", colors: ["#065F46", "#10B981", "#D1FAE5"] },
  { id: "neon", name: "Neon", colors: ["#FF00FF", "#00FFFF", "#FFFF00"] },
  { id: "pastel", name: "Pastel", colors: ["#FFB5E8", "#B5DEFF", "#FFF5BA"] },
];

const fonts = [
  "Inter", "Playfair Display", "Bebas Neue", "Roboto Mono", "Poppins", "Oswald"
];

export default function AlbumCover() {
  const [albumTitle, setAlbumTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("minimalist");
  const [selectedColorScheme, setSelectedColorScheme] = useState("monochrome");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [fontSize, setFontSize] = useState([48]);
  const [textOpacity, setTextOpacity] = useState([100]);

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await apiClient.projects.$get();
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.projects.$post({
        json: data,
      });
      if (!res.ok) throw new Error("Failed to save project");
      return res.json();
    },
    onSuccess: () => {
      alert("Album cover saved successfully!");
    },
  });

  const handleSave = () => {
    if (!albumTitle || !artistName) {
      alert("Please enter album title and artist name");
      return;
    }

    const projectData = {
      type: "album-cover" as const,
      title: `${albumTitle} - ${artistName}`,
      description: description || undefined,
      data: JSON.stringify({
        albumTitle,
        artistName,
        style: selectedStyle,
        colorScheme: selectedColorScheme,
        font: selectedFont,
        fontSize: fontSize[0],
        textOpacity: textOpacity[0],
      }),
    };

    saveProjectMutation.mutate(projectData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Album Cover Designer</h1>
          <p className="text-muted-foreground">
            Create stunning album covers with AI-powered design tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Album Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="album">Album Title</Label>
                  <Input
                    id="album"
                    placeholder="Enter album title"
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="artist">Artist Name</Label>
                  <Input
                    id="artist"
                    placeholder="Enter artist name"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Visual Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the mood, themes, or visual elements you want..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Design Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="style" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="typography">Typography</TabsTrigger>
                  </TabsList>

                  <TabsContent value="style" className="space-y-3">
                    {artStyles.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedStyle === style.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <h3 className="font-semibold mb-1">{style.name}</h3>
                        <p className="text-sm text-muted-foreground">{style.description}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-3">
                    {colorSchemes.map((scheme) => (
                      <div
                        key={scheme.id}
                        onClick={() => setSelectedColorScheme(scheme.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedColorScheme === scheme.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{scheme.name}</h3>
                          <div className="flex gap-1">
                            {scheme.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-4">
                    <div>
                      <Label>Font Family</Label>
                      <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fonts.map((font) => (
                            <SelectItem key={font} value={font}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Font Size</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        min={24}
                        max={96}
                        step={4}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {fontSize[0]}px
                      </p>
                    </div>

                    <div>
                      <Label>Text Opacity</Label>
                      <Slider
                        value={textOpacity}
                        onValueChange={setTextOpacity}
                        min={0}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {textOpacity[0]}%
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex gap-3">
                  <Button className="flex-1" disabled={!albumTitle || !artistName}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Cover
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>1000x1000px (Square)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src="/album-cover-example-AFEw6.png"
                    alt="Album cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {albumTitle && artistName && (
                  <div className="mt-4 space-y-1">
                    <p className="font-semibold">{albumTitle}</p>
                    <p className="text-sm text-muted-foreground">{artistName}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleSave} disabled={!albumTitle || !artistName}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download (PNG)
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download (JPG)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Covers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projectsData?.projects
                    ?.filter((p: any) => p.type === "album-cover")
                    .slice(0, 5)
                    .map((project: any) => (
                      <div
                        key={project.id}
                        className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      >
                        <p className="font-medium text-sm">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
