import { NextRequest, NextResponse } from 'next/server';
import { HTMLPDFGenerator } from '../../../lib/pdf/html-generator';
import { BusinessCardData } from '../../../types/business-card';
import { validateBusinessCard } from '../../../utils/validation';
import { uploadFileWithMetadata } from '../../../lib/storage/file-manager';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate the business card data
    const validationResult = validateBusinessCard(body);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.errors },
        { status: 400 }
      );
    }

    const businessCardData: BusinessCardData = validationResult.data!;
    
    // Get options from request
    const includeBleed = body.includeBleed || false;
    
    // Create PDF generator with proper Vercel configuration
    const generator = new HTMLPDFGenerator({
      includeBleed
    });

    // Generate PDF
    const pdfBuffer = await generator.generatePDF(businessCardData);

    // Create filename
    const filename = `CBRE-BusinessCard-${businessCardData.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Upload to Supabase Storage
    const { id, downloadUrl, expiresAt } = await uploadFileWithMetadata(
      filename,
      pdfBuffer,
      'application/pdf',
      'single'
    );

    // Return file info instead of direct PDF
    return NextResponse.json({
      success: true,
      fileId: id,
      downloadUrl,
      filename,
      expiresAt: expiresAt.toISOString(),
      message: 'PDF generated successfully'
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'PDF generation endpoint. Use POST to generate a PDF.' });
} 