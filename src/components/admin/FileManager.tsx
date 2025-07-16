'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { toast } from "@/src/components/cbre/CBREToast";

interface FileStatistics {
  totalFiles: number;
  totalSize: number;
  singleCardFiles: number;
  batchFiles: number;
  averageDownloads: number;
}

interface CleanupResult {
  filesDeletedCount: number;
  sizeFreedUp: number;
  timestamp: string;
  remainingFiles: number;
  remainingSize: number;
}

export function FileManager() {
  const [statistics, setStatistics] = useState<FileStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<CleanupResult | null>(null);

  // Fetch file statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/cleanup');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      
      const data = await response.json();
      setStatistics(data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch file statistics",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger manual cleanup
  const triggerCleanup = async () => {
    setCleanupLoading(true);
    try {
      const response = await fetch('/api/cleanup', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Cleanup failed');
      
      const data = await response.json();
      setLastCleanup(data.result);
      
      // Refresh statistics
      await fetchStatistics();
      
      toast({
        title: "Cleanup Complete",
        description: `Deleted ${data.result.filesDeletedCount} files, freed up ${formatBytes(data.result.sizeFreedUp)}`,
        variant: "success"
      });
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast({
        title: "Cleanup Error",
        description: "Failed to perform cleanup",
        variant: "error"
      });
    } finally {
      setCleanupLoading(false);
    }
  };

  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>File Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading statistics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.totalFiles}
              </div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatBytes(statistics.totalSize)}
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.singleCardFiles}
              </div>
              <div className="text-sm text-gray-600">Single Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.batchFiles}
              </div>
              <div className="text-sm text-gray-600">Batch Files</div>
            </div>
          </div>
        )}

        <Separator />

        {/* Cleanup Controls */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">File Cleanup</h3>
              <p className="text-sm text-gray-600">
                Automatically removes files older than 24 hours
              </p>
            </div>
            <Button
              onClick={triggerCleanup}
              disabled={cleanupLoading}
              variant="outline"
            >
              {cleanupLoading ? 'Cleaning...' : 'Run Cleanup'}
            </Button>
          </div>

          {lastCleanup && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Last Cleanup Result</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Files Deleted: <Badge variant="secondary">{lastCleanup.filesDeletedCount}</Badge></div>
                <div>Size Freed: <Badge variant="secondary">{formatBytes(lastCleanup.sizeFreedUp)}</Badge></div>
                <div>Remaining Files: <Badge variant="outline">{lastCleanup.remainingFiles}</Badge></div>
                <div>Remaining Size: <Badge variant="outline">{formatBytes(lastCleanup.remainingSize)}</Badge></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(lastCleanup.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button
            onClick={fetchStatistics}
            variant="ghost"
            size="sm"
          >
            Refresh Statistics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 