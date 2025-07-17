/**
 * Text processing utilities for business card generation
 */

/**
 * Convert newline characters to HTML <br> tags
 * @param text - The text containing newline characters
 * @returns HTML string with <br> tags instead of \n
 */
export function convertNewlinesToBr(text: string): string {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

/**
 * Convert newline characters to spaces (for single-line fields)
 * @param text - The text containing newline characters  
 * @returns Text with newlines converted to spaces
 */
export function convertNewlinesToSpaces(text: string): string {
  if (!text) return '';
  return text.replace(/\n/g, ' ');
}

/**
 * Escape HTML special characters while preserving line breaks
 * @param text - The text to escape
 * @returns HTML-safe text
 */
export function escapeHtmlPreservingLineBreaks(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

/**
 * Split text by line breaks for PDFKit rendering
 * @param text - The text containing newline characters
 * @returns Array of text lines
 */
export function splitTextByLines(text: string): string[] {
  if (!text) return [''];
  return text.split('\n');
}

/**
 * Truncate text while preserving line breaks
 * @param text - The text to truncate
 * @param maxLength - Maximum length per line
 * @returns Truncated text with line breaks preserved
 */
export function truncatePreservingLineBreaks(text: string, maxLength: number): string {
  if (!text) return '';
  
  const lines = text.split('\n');
  const truncatedLines = lines.map(line => 
    line.length > maxLength ? line.substring(0, maxLength - 3) + '...' : line
  );
  
  return truncatedLines.join('\n');
} 