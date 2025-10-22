"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

export default function AIPromptPage() {
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(200);
  const [seed, setSeed] = useState(0);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          temperature,
          topP,
        }),
      });

      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      setResponse("Fehler beim Generieren der Antwort.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen bg-background">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">KI Prompt Generator</CardTitle>
          <CardDescription>
            Geben Sie einen Prompt ein und passen Sie die Parameter an
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Geben Sie hier Ihren Prompt ein..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 resize-none"
                required
              />
            </div>

            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {temperature.toFixed(2)}
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(Number.parseFloat(e.target.value))
                  }
                />
                <p className="text-muted-foreground text-xs">
                  Steuert die Zufälligkeit (0 = deterministisch, 2 = sehr
                  kreativ)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topP">Top P: {topP.toFixed(2)}</Label>
                <Input
                  id="topP"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={topP}
                  onChange={(e) => setTopP(Number.parseFloat(e.target.value))}
                />
                <p className="text-muted-foreground text-xs">
                  Nucleus Sampling (0.1 = konservativ, 1.0 = vielfältig)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max. Tokens: {maxTokens}</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="0"
                  max="10000"
                  step="1"
                  value={maxTokens}
                  onChange={(e) =>
                    setMaxTokens(Number.parseInt(e.target.value))
                  }
                />
                <p className="text-muted-foreground text-xs">
                  Steuert die Länge des Outputs (max: 10000)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seed">Seed: {seed}</Label>
                <Input
                  id="seed"
                  type="number"
                  min="0"
                  max="10000"
                  step="1"
                  value={seed}
                  onChange={(e) => setSeed(Number.parseInt(e.target.value))}
                />
                <p className="text-muted-foreground text-xs">
                  Wenn &#62; 0, versucht das System so deterministisch zu sein,
                  wie es geht
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Generiere...
                </>
              ) : (
                "Generieren"
              )}
            </Button>
          </form>

          {response && (
            <div className="mt-6 space-y-2">
              <Label>Response</Label>
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    <Markdown>{response}</Markdown>
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
