import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layers, Save, Play, Download, Wand2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface SongStructure {
  id: string;
  name: string;
  sections: string[];
}

interface MelodyPattern {
  id: string;
  name: string;
  scale: string;
  notes: number[];
}

const songStructures: SongStructure[] = [
  { id: "pop", name: "Pop Standard", sections: ["Intro", "Verse", "Chorus", "Verse", "Chorus", "Bridge", "Chorus", "Outro"] },
  { id: "edm", name: "EDM Banger", sections: ["Intro", "Build", "Drop", "Break", "Build", "Drop", "Outro"] },
  { id: "hiphop", name: "Hip-Hop Classic", sections: ["Intro", "Verse", "Hook", "Verse", "Hook", "Bridge", "Hook", "Outro"] },
  { id: "rock", name: "Rock Anthem", sections: ["Intro", "Verse", "Pre-Chorus", "Chorus", "Verse", "Pre-Chorus", "Chorus", "Solo", "Chorus", "Outro"] },
];

const scales = ["Major", "Minor", "Pentatonic", "Blues", "Dorian", "Mixolydian"];
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const melodyPatterns: MelodyPattern[] = [
  { id: "ascending", name: "Ascending", scale: "Major", notes: [0, 2, 4, 5, 7, 9, 11, 12] },
  { id: "descending", name: "Descending", scale: "Minor", notes: [12, 10, 8, 7, 5, 3, 1, 0] },
  { id: "arpeggio", name: "Arpeggio", scale: "Major", notes: [0, 4, 7, 12, 7, 4, 0] },
  { id: "pentatonic", name: "Pentatonic Run", scale: "Pentatonic", notes: [0, 2, 4, 7, 9, 12] },
];

const percussionPatterns = [
  { id: "four-floor", name: "Four on the Floor", tempo: "120-130 BPM" },
  { id: "trap", name: "Trap", tempo: "140-160 BPM" },
  { id: "boom-bap", name: "Boom Bap", tempo: "85-95 BPM" },
  { id: "dnb", name: "Drum & Bass", tempo: "170-180 BPM" },
];

export default function SongBuilder() {
  const [songTitle, setSongTitle] = useState("");
  const [selectedStructure, setSelectedStructure] = useState<string>("pop");
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedScale, setSelectedScale] = useState("Major");
  const [selectedMelody, setSelectedMelody] = useState<string>("ascending");
  const [selectedPercussion, setSelectedPercussion] = useState<string>("four-floor");
  const [tempo, setTempo] = useState(120);

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
      alert("Song saved successfully!");
    },
  });

  const handleSave = () => {
    if (!songTitle) {
      alert("Please enter a song title");
      return;
    }

    const structure = songStructures.find((s) => s.id === selectedStructure);
    const melody = melodyPatterns.find((m) => m.id === selectedMelody);
    const percussion = percussionPatterns.find((p) => p.id === selectedPercussion);

    const projectData = {
      type: "song" as const,
      title: songTitle,
      description: `${structure?.name} - ${selectedKey} ${selectedScale}`,
      data: JSON.stringify({
        structure: structure?.sections,
        key: selectedKey,
        scale: selectedScale,
        melody: melody?.notes,
        percussion: percussion?.id,
        tempo,
      }),
    };

    saveProjectMutation.mutate(projectData);
  };

  const currentStructure = songStructures.find((s) => s.id === selectedStructure);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Song Builder</h1>
          <p className="text-muted-foreground">
            Create songs from scratch using professional templates and structures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Song Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Song Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your song title"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tempo">Tempo (BPM)</Label>
                    <Input
                      id="tempo"
                      type="number"
                      value={tempo}
                      onChange={(e) => setTempo(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="key">Key</Label>
                    <Select value={selectedKey} onValueChange={setSelectedKey}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {keys.map((key) => (
                          <SelectItem key={key} value={key}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="structure" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                    <TabsTrigger value="melody">Melody</TabsTrigger>
                    <TabsTrigger value="percussion">Percussion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="structure" className="space-y-4">
                    <div className="space-y-3">
                      {songStructures.map((structure) => (
                        <div
                          key={structure.id}
                          onClick={() => setSelectedStructure(structure.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedStructure === structure.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{structure.name}</h3>
                            <Badge variant="outline">{structure.sections.length} sections</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {structure.sections.map((section, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="melody" className="space-y-4">
                    <div>
                      <Label>Scale</Label>
                      <Select value={selectedScale} onValueChange={setSelectedScale}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {scales.map((scale) => (
                            <SelectItem key={scale} value={scale}>
                              {scale}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Melody Pattern</Label>
                      {melodyPatterns.map((pattern) => (
                        <div
                          key={pattern.id}
                          onClick={() => setSelectedMelody(pattern.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedMelody === pattern.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{pattern.name}</h3>
                              <p className="text-sm text-muted-foreground">{pattern.scale} scale</p>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="percussion" className="space-y-4">
                    <div className="space-y-3">
                      {percussionPatterns.map((pattern) => (
                        <div
                          key={pattern.id}
                          onClick={() => setSelectedPercussion(pattern.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedPercussion === pattern.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{pattern.name}</h3>
                              <p className="text-sm text-muted-foreground">{pattern.tempo}</p>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <img
                    src="/studio-interface-TA7ok.png"
                    alt="Studio preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Structure:</span>
                    <span className="font-medium">{currentStructure?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Key:</span>
                    <span className="font-medium">{selectedKey} {selectedScale}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tempo:</span>
                    <span className="font-medium">{tempo} BPM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Preview Song
                </Button>
                <Button className="w-full" variant="outline" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export MIDI
                </Button>
                <Button className="w-full" variant="outline">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Lyrics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Songs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projectsData?.projects
                    ?.filter((p) => p.type === "song")
                    .slice(0, 5)
                    .map((project) => (
                      <div
                        key={project.id}
                        className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      >
                        <p className="font-medium text-sm">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
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
