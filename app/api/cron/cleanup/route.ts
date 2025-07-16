import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredFilesAndMetadata, getFileStatistics } from '../../../../lib/storage/file-manager';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job request (optional security check)
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Running scheduled cleanup...');
    
    // Get statistics before cleanup
    const statsBefore = getFileStatistics();
    
    // Perform cleanup
    await cleanupExpiredFilesAndMetadata();
    
    // Get statistics after cleanup
    const statsAfter = getFileStatistics();
    
    const cleanupResult = {
      filesDeletedCount: statsBefore.totalFiles - statsAfter.totalFiles,
      sizeFreedUp: statsBefore.totalSize - statsAfter.totalSize,
      timestamp: new Date().toISOString(),
      remainingFiles: statsAfter.totalFiles,
      remainingSize: statsAfter.totalSize
    };
    
    console.log('Cleanup completed:', cleanupResult);
    
    return NextResponse.json({
      success: true,
      message: 'Scheduled cleanup completed successfully',
      result: cleanupResult
    });
    
  } catch (error) {
    console.error('Scheduled cleanup error:', error);
    return NextResponse.json(
      { error: 'Scheduled cleanup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
} 