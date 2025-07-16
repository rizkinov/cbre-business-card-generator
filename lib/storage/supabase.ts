import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend operations (using anon key with RLS policies)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Storage bucket name
export const STORAGE_BUCKET = 'business-cards';

// File upload settings
export const UPLOAD_SETTINGS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf', 'application/zip'],
  expirationHours: 24
};

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<{ url: string; path: string }> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, fileBuffer, {
      contentType,
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    path: data.path
  };
}

/**
 * Generate signed URL for file download
 */
export async function getSignedUrl(fileName: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(fileName, 60 * 60); // 1 hour expiry

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete file from storage
 */
export async function deleteFile(fileName: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([fileName]);

  if (error) {
    throw new Error(`File deletion failed: ${error.message}`);
  }
}

/**
 * Clean up expired files
 */
export async function cleanupExpiredFiles(): Promise<void> {
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() - UPLOAD_SETTINGS.expirationHours);

  const { data: files, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .list('', {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'asc' }
    });

  if (error) {
    console.error('Error listing files for cleanup:', error);
    return;
  }

  const expiredFiles = files.filter(file => {
    const fileDate = new Date(file.created_at);
    return fileDate < expirationTime;
  });

  if (expiredFiles.length > 0) {
    const fileNames = expiredFiles.map(file => file.name);
    const { error: deleteError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove(fileNames);

    if (deleteError) {
      console.error('Error deleting expired files:', deleteError);
    } else {
      console.log(`Cleaned up ${expiredFiles.length} expired files`);
    }
  }
} 