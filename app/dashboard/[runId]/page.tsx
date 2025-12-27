'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, 
  TrendingUp, Code, FileJson, Activity, Timer 
} from 'lucide-react';

interface XRayEvaluation {
  itemName: string;
  passed: boolean;
  details: Record<string, unknown>;
  score?: number;
}

interface XRayStep {
  stepName: string;
  timestamp: string;
  durationMs?: number;
  status: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  evaluations?: XRayEvaluation[];
  reasoning: string;
  metadata?: Record<string, unknown>;
}

interface XRayRun {
  runId: string;
  startTime: string;
  endTime?: string;
  totalDurationMs?: number;
  status: string;
  pipelineName: string;
  steps: XRayStep[];
  summary?: Record<string, unknown>;
}

export default function RunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const resolvedParams = use(params);
  const [run, setRun] = useState<XRayRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/runs/${resolvedParams.runId}`);
        const data = await response.json();
        if (data.run) {
          setRun(data.run);
        } else {
          setError('Run not found');
        }
      } catch (err) {
        setError('Failed to load run details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRun();
  }, [resolvedParams.runId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'failure':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600">Success</Badge>;
      case 'failure':
        return <Badge variant="destructive">Failure</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-600">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 animate-pulse" />
                Loading Run Details...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fetching execution data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Error Loading Run
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error || 'Run not found'}</p>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            {run.pipelineName}
          </h1>
          <p className="text-sm text-muted-foreground font-mono">Run ID: {run.runId}</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Execution Summary
            </CardTitle>
            <CardDescription>
              Complete overview of pipeline execution
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Status
                </p>
                <p className="text-2xl font-bold">{getStatusBadge(run.status)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Duration
                </p>
                <p className="text-2xl font-bold">
                  {run.totalDurationMs ? `${run.totalDurationMs}ms` : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Steps
                </p>
                <p className="text-2xl font-bold">{run.steps.length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Start Time
                </p>
                <p className="text-sm font-semibold">
                  {new Date(run.startTime).toLocaleString()}
                </p>
              </div>
            </div>
            {run.summary && (
              <>
                <Separator className="my-6" />
                <div>
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileJson className="w-4 h-4" />
                    Pipeline Summary
                  </p>
                  <ScrollArea className="h-32">
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                      {JSON.stringify(run.summary, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Execution Timeline ({run.steps.length} Steps)
            </CardTitle>
            <CardDescription>
              Detailed step-by-step execution with reasoning and evaluations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {run.steps.map((step, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {getStatusIcon(step.status)}
                        <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-950 rounded-full px-1.5 py-0.5 text-[10px] font-bold border">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-base">{step.stepName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(step.timestamp).toLocaleTimeString()}
                          {step.durationMs && (
                            <>
                              <span>•</span>
                              <Timer className="w-3 h-3" />
                              {step.durationMs}ms
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(step.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                    <CardContent className="pt-4">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Reasoning
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{step.reasoning}</p>
                    </CardContent>
                  </Card>

                  {step.evaluations && step.evaluations.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Evaluations ({step.evaluations.length})
                      </p>
                      <div className="grid gap-3">
                        {step.evaluations.map((evaluation, evalIndex) => (
                          <Card
                            key={evalIndex}
                            className={`${
                              evaluation.passed
                                ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'
                                : 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900'
                            }`}
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">{evaluation.itemName}</span>
                                {evaluation.passed ? (
                                  <Badge className="bg-green-600">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    PASS
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    FAIL
                                  </Badge>
                                )}
                              </div>
                              {evaluation.score !== undefined && (
                                <p className="text-xs text-muted-foreground">
                                  Score: <span className="font-semibold">{evaluation.score}/10</span>
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <Tabs defaultValue="input" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="input">Input</TabsTrigger>
                      <TabsTrigger value="output">Output</TabsTrigger>
                      <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    </TabsList>
                    <TabsContent value="input" className="mt-4">
                      <ScrollArea className="h-48">
                        <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                          {JSON.stringify(step.input, null, 2)}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="output" className="mt-4">
                      <ScrollArea className="h-48">
                        <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                          {JSON.stringify(step.output, null, 2)}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="metadata" className="mt-4">
                      {step.metadata ? (
                        <ScrollArea className="h-48">
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                            {JSON.stringify(step.metadata, null, 2)}
                          </pre>
                        </ScrollArea>
                      ) : (
                        <p className="text-sm text-muted-foreground p-4 text-center">
                          No metadata available
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
