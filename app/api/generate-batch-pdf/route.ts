import { NextRequest, NextResponse } from 'next/server';
import { HTMLPDFGenerator } from '../../../lib/pdf/html-generator';
import { BusinessCardData } from '../../../types/business-card';
import { validateCSVData } from '../../../utils/validation';
import { uploadFileWithMetadata } from '../../../lib/storage/file-manager';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { csvData, includeBleed = false } = body;
    
    if (!csvData || !Array.isArray(csvData)) {
      return NextResponse.json(
        { error: 'Invalid CSV data provided' },
        { status: 400 }
      );
    }

    // Convert CSV data to BusinessCardData format if needed
    let businessCardDataArray: BusinessCardData[];
    
    // Check if data is already in BusinessCardData format (from CSVUploader)
    if (csvData.length > 0 && 'fullName' in csvData[0]) {
      // Data is already in BusinessCardData format
      businessCardDataArray = csvData as BusinessCardData[];
    } else {
      // Data is in raw CSV format, need to validate and convert
      const validationResult = validateCSVData(csvData);
      if (!validationResult.isValid || !validationResult.data) {
        return NextResponse.json(
          { error: 'Invalid CSV data', details: validationResult.errors },
          { status: 400 }
        );
      }
      businessCardDataArray = validationResult.data;
    }
    
    // Create ZIP file for multiple PDFs
    const zip = new JSZip();
    
    // Generate PDFs for each entry
    const generationPromises = businessCardDataArray.map(async (businessCardData, index) => {
      try {
        // Create PDF generator
        const generator = new HTMLPDFGenerator({
          includeBleed
        });

        // Generate PDF
        const pdfBuffer = await generator.generatePDF(businessCardData);
        
        // Create filename
        const filename = `${businessCardData.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_BusinessCard.pdf`;
        
        // Add to ZIP
        zip.file(filename, pdfBuffer);
        
        return { success: true, filename, name: businessCardData.fullName };
      } catch (error) {
        console.error(`Error generating PDF for ${businessCardData.fullName}:`, error);
        return { 
          success: false, 
          filename: `${businessCardData.fullName}_BusinessCard.pdf`, 
          name: businessCardData.fullName,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Wait for all PDFs to be generated
    const results = await Promise.all(generationPromises);
    
    // Check if any PDFs were generated successfully
    const successfulResults = results.filter(result => result.success);
    const failedResults = results.filter(result => !result.success);

    if (successfulResults.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any PDFs', details: failedResults },
        { status: 500 }
      );
    }

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Create filename for ZIP
    const timestamp = new Date().toISOString().split('T')[0];
    const zipFilename = `CBRE_BusinessCards_Batch_${timestamp}.zip`;

    // Upload ZIP to Supabase Storage
    const { id, downloadUrl, expiresAt } = await uploadFileWithMetadata(
      zipFilename,
      zipBuffer,
      'application/zip',
      'batch'
    );

    // Prepare response metadata
    const metadata = {
      totalEntries: businessCardDataArray.length,
      successfulGenerations: successfulResults.length,
      failedGenerations: failedResults.length,
      results: results,
      zipSize: zipBuffer.length,
      fileId: id,
      downloadUrl,
      expiresAt: expiresAt.toISOString()
    };

    // Return metadata and download info
    return NextResponse.json({
      success: true,
      fileId: id,
      downloadUrl,
      filename: zipFilename,
      expiresAt: expiresAt.toISOString(),
      message: 'Batch PDFs generated successfully',
      metadata
    });

  } catch (error) {
    console.error('Batch PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate batch PDFs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Batch PDF generation endpoint. Use POST with CSV data to generate multiple PDFs.',
    expectedFormat: {
      csvData: 'Array of business card data objects',
      includeBleed: 'Boolean (optional, defaults to false)'
    }
  });
} 