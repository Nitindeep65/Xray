'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Play, Eye, CheckCircle2, XCircle, Loader2,
  FileText, Filter, Heart, Award
} from 'lucide-react';

interface PipelineResult {
  runId: string;
  summary: {
    totalCandidates: number;
    selected: number;
  };
}

export default function Home() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const runPipeline = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const response = await fetch('/api/pipeline/run', {
        method: 'POST',
      });
      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run pipeline');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Failed to run pipeline');
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const pipelineSteps = [
    {
      step: 1,
      title: 'Resume Parsing',
      description: 'Extract skills, experience, and bio summary from each candidate.',
      icon: FileText,
    },
    {
      step: 2,
      title: 'Technical Filter',
      description: 'Check minimum experience and required skills. Records rejection reasons.',
      icon: Filter,
    },
    {
      step: 3,
      title: 'Culture Fit',
      description: 'Score candidates based on alignment with company values.',
      icon: Heart,
    },
    {
      step: 4,
      title: 'Final Selection',
      description: 'Rank by composite score and select top candidates.',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            X-Ray Debugging System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Multi-step process visualization with reasoning and decision tracking.
            See exactly <span className="font-medium text-foreground">why</span> every decision was made.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demo: Hiring Screener</CardTitle>
            <CardDescription>
              Evaluate candidates through multiple steps with complete transparency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              This demo pipeline evaluates candidates through 4 steps: 
              resume parsing, technical filtering, culture fit evaluation, and final selection. 
              Each step logs detailed reasoning about why decisions were made.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                onClick={runPipeline} 
                disabled={running}
              >
                {running ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Pipeline
                  </>
                )}
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <Eye className="w-4 h-4 mr-2" />
                  View Dashboard
                </Link>
              </Button>
            </div>

            {running && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Pipeline completed</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Run ID:</span> <code className="text-xs bg-muted px-1 py-0.5 rounded">{result.runId}</code></p>
                    <p><span className="font-medium">Results:</span> Selected {result.summary.selected} from {result.summary.totalCandidates} candidates</p>
                  </div>
                  <Button asChild className="mt-4" size="sm" variant="outline">
                    <Link href={`/dashboard/${result.runId}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Results
                    </Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {pipelineSteps.map((step) => (
            <Card key={step.step}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Step {step.step}</Badge>
                  <CardTitle className="text-base flex items-center gap-2">
                    <step.icon className="w-4 h-4 text-muted-foreground" />
                    {step.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Reasoning Capture</p>
                  <p className="text-sm text-muted-foreground">Every step records why decisions were made</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Pass/Fail Tracking</p>
                  <p className="text-sm text-muted-foreground">See which items passed or failed with details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Timeline View</p>
                  <p className="text-sm text-muted-foreground">Complete execution history with timestamps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
