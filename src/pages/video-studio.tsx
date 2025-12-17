import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Upload, Play, Save, Share2, Wand2, Music, Video } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export default function VideoStudio() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoStyle, setVideoStyle] = useState("cinematic");
  const [tempo, setTempo] = useState([120]);
  const [intensity, setIntensity] = useState([50]);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      alert("Project saved successfully!");
    },
  });

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSaveProject = () => {
    if (!audioFile) {
      alert("Please upload an audio file first");
      return;
    }

    const projectData = {
      type: "video" as const,
      title: audioFile.name.replace(/\.[^/.]+$/, ""),
      description: `Video project with ${videoStyle} style`,
      data: JSON.stringify({
        audioFile: audioFile.name,
        videoStyle,
        tempo: tempo[0],
        intensity: intensity[0],
      }),
    };

    saveProjectMutation.mutate(projectData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Music Video Studio</h1>
          <p className="text-muted-foreground">
            Upload audio, extract vocals, remix instrumentals, and generate stunning visuals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Audio
                </CardTitle>
                <CardDescription>
                  Upload your audio file to get started with video generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <Label htmlFor="audio-upload" className="cursor-pointer">
                    <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      {audioFile ? audioFile.name : "Click to upload audio"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP3, WAV, OGG up to 50MB
                    </p>
                  </Label>
                </div>

                {audioFile && (
                  <div className="space-y-4">
                    <audio ref={audioRef} controls className="w-full">
                      <source src={URL.createObjectURL(audioFile)} />
                    </audio>

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full">
                        <Wand2 className="h-4 w-4 mr-2" />
                        Extract Vocals
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Music className="h-4 w-4 mr-2" />
                        Remix Instrumental
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Generation
                </CardTitle>
                <CardDescription>
                  Customize your music video style and parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="style" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="effects">Effects</TabsTrigger>
                    <TabsTrigger value="timing">Timing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="style" className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {["Cinematic", "Abstract", "Retro", "Neon", "Nature", "Urban"].map((style) => (
                        <Button
                          key={style}
                          variant={videoStyle === style.toLowerCase() ? "default" : "outline"}
                          onClick={() => setVideoStyle(style.toLowerCase())}
                          className="w-full"
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="effects" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Intensity</Label>
                        <Slider
                          value={intensity}
                          onValueChange={setIntensity}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {intensity[0]}%
                        </p>
                      </div>

                      <div>
                        <Label>Color Saturation</Label>
                        <Slider
                          defaultValue={[70]}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Motion Blur</Label>
                        <Slider
                          defaultValue={[30]}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timing" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Tempo (BPM)</Label>
                        <Slider
                          value={tempo}
                          onValueChange={setTempo}
                          min={60}
                          max={200}
                          step={1}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {tempo[0]} BPM
                        </p>
                      </div>

                      <div>
                        <Label>Scene Duration</Label>
                        <Slider
                          defaultValue={[4]}
                          min={1}
                          max={10}
                          step={0.5}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex gap-3">
                  <Button className="flex-1" disabled={!audioFile}>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your generated video will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src="/video-editor-_2QfS.png"
                    alt="Video preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleSaveProject} disabled={!audioFile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share to Gallery
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projectsData?.projects
                    ?.filter((p) => p.type === "video")
                    .slice(0, 5)
                    .map((project) => (
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
