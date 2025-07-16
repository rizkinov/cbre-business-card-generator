import { NextRequest, NextResponse } from 'next/server';
import { generateDownloadUrl, getFileMetadata } from '../../../../lib/storage/file-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Get file metadata
    const metadata = getFileMetadata(fileId);
    if (!metadata) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if file has expired
    if (new Date() > metadata.expiresAt) {
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 410 }
      );
    }

    // Generate download URL
    const downloadUrl = await generateDownloadUrl(fileId);
    
    // Return redirect to the signed URL
    return NextResponse.redirect(downloadUrl);
    
  } catch (error) {
    console.error('Download error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'File not found') {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'File has expired') {
        return NextResponse.json(
          { error: 'File has expired' },
          { status: 410 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
}

// Optional: Add HEAD method for checking file existence
export async function HEAD(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    
    if (!fileId) {
      return new NextResponse(null, { status: 400 });
    }

    // Get file metadata
    const metadata = getFileMetadata(fileId);
    if (!metadata) {
      return new NextResponse(null, { status: 404 });
    }

    // Check if file has expired
    if (new Date() > metadata.expiresAt) {
      return new NextResponse(null, { status: 410 });
    }

    // Return headers with file info
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': metadata.contentType,
        'Content-Length': metadata.size.toString(),
        'X-File-Name': metadata.originalName,
        'X-File-Type': metadata.type,
        'X-Upload-Date': metadata.uploadedAt.toISOString(),
        'X-Expires-At': metadata.expiresAt.toISOString()
      }
    });
    
  } catch (error) {
    console.error('HEAD request error:', error);
    return new NextResponse(null, { status: 500 });
  }
} 