import { uploadFile, getSignedUrl, deleteFile, cleanupExpiredFiles } from './supabase';
import { generateUniqueFilename } from '../../utils/validation';

export interface FileMetadata {
  id: string;
  originalName: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
  expiresAt: Date;
  downloadCount: number;
  type: 'single' | 'batch';
  userId?: string;
}

// In-memory storage for file metadata (in production, use a database)
const fileMetadataStore = new Map<string, FileMetadata>();

/**
 * Generate unique file ID
 */
function generateFileId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Upload file with metadata tracking
 */
export async function uploadFileWithMetadata(
  originalName: string,
  fileBuffer: Buffer,
  contentType: string,
  type: 'single' | 'batch' = 'single',
  userId?: string
): Promise<{ id: string; downloadUrl: string; expiresAt: Date }> {
  const fileId = generateFileId();
  const filename = generateUniqueFilename(originalName);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  try {
    // Upload to Supabase Storage
    const { url, path } = await uploadFile(filename, fileBuffer, contentType);
    
    // Store metadata
    const metadata: FileMetadata = {
      id: fileId,
      originalName,
      filename,
      contentType,
      size: fileBuffer.length,
      uploadedAt: now,
      expiresAt,
      downloadCount: 0,
      type,
      userId
    };
    
    fileMetadataStore.set(fileId, metadata);
    
    // Generate signed URL for download
    const downloadUrl = await getSignedUrl(filename);
    
    return {
      id: fileId,
      downloadUrl,
      expiresAt
    };
    
  } catch (error) {
    console.error('File upload failed:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Get file metadata
 */
export function getFileMetadata(fileId: string): FileMetadata | undefined {
  return fileMetadataStore.get(fileId);
}

/**
 * Generate download URL for file
 */
export async function generateDownloadUrl(fileId: string): Promise<string> {
  const metadata = fileMetadataStore.get(fileId);
  if (!metadata) {
    throw new Error('File not found');
  }

  // Check if file has expired
  if (new Date() > metadata.expiresAt) {
    // Clean up expired file
    await deleteFileById(fileId);
    throw new Error('File has expired');
  }

  // Increment download count
  metadata.downloadCount++;
  fileMetadataStore.set(fileId, metadata);

  // Generate new signed URL
  return await getSignedUrl(metadata.filename);
}

/**
 * Delete file by ID
 */
export async function deleteFileById(fileId: string): Promise<void> {
  const metadata = fileMetadataStore.get(fileId);
  if (!metadata) {
    throw new Error('File not found');
  }

  try {
    await deleteFile(metadata.filename);
    fileMetadataStore.delete(fileId);
  } catch (error) {
    console.error('File deletion failed:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Clean up expired files and metadata
 */
export async function cleanupExpiredFilesAndMetadata(): Promise<void> {
  const now = new Date();
  const expiredFiles: string[] = [];

  // Find expired files in metadata store
  for (const [fileId, metadata] of fileMetadataStore.entries()) {
    if (now > metadata.expiresAt) {
      expiredFiles.push(fileId);
    }
  }

  // Delete expired files
  for (const fileId of expiredFiles) {
    try {
      await deleteFileById(fileId);
    } catch (error) {
      console.error(`Failed to delete expired file ${fileId}:`, error);
    }
  }

  // Also run the general cleanup
  await cleanupExpiredFiles();

  console.log(`Cleaned up ${expiredFiles.length} expired files`);
}

/**
 * Get all file metadata (for admin purposes)
 */
export function getAllFileMetadata(): FileMetadata[] {
  return Array.from(fileMetadataStore.values());
}

/**
 * Get file statistics
 */
export function getFileStatistics(): {
  totalFiles: number;
  totalSize: number;
  singleCardFiles: number;
  batchFiles: number;
  averageDownloads: number;
} {
  const allFiles = getAllFileMetadata();
  const totalFiles = allFiles.length;
  const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
  const singleCardFiles = allFiles.filter(file => file.type === 'single').length;
  const batchFiles = allFiles.filter(file => file.type === 'batch').length;
  const totalDownloads = allFiles.reduce((sum, file) => sum + file.downloadCount, 0);
  const averageDownloads = totalFiles > 0 ? totalDownloads / totalFiles : 0;

  return {
    totalFiles,
    totalSize,
    singleCardFiles,
    batchFiles,
    averageDownloads
  };
} 