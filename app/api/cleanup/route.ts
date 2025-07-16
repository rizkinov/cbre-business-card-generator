import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredFilesAndMetadata, getFileStatistics } from '../../../lib/storage/file-manager';

export async function POST(_request: NextRequest) {
  try {
    // Optional: Add authentication check here
    // const apiKey = request.headers.get('Authorization');
    // if (apiKey !== `Bearer ${process.env.CLEANUP_API_KEY}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

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
    
    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      result: cleanupResult
    });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to perform cleanup', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    // Return current file statistics
    const stats = getFileStatistics();
    
    return NextResponse.json({
      statistics: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Stats retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve statistics' },
      { status: 500 }
    );
  }
} 