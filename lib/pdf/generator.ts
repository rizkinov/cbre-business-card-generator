import PDFDocument from 'pdfkit';
import { BusinessCardData } from '@/types/business-card';

// CMYK to RGB conversion (approximate)
// These values are calibrated to match CBRE's CMYK requirements as closely as possible
export const CBRE_COLORS = {
  // CBRE Green: CMYK(90, 46, 80, 55) -> RGB approximation
  green: '#1E5A41',
  // Dark Green: CMYK(91, 62, 62, 65) -> RGB approximation  
  darkGreen: '#1A3D32',
  // Dark Grey: CMYK(73, 55, 55, 33) -> RGB approximation
  darkGrey: '#4A4A4A',
  // White: CMYK(0, 0, 0, 0)
  white: '#FFFFFF',
  // Black: CMYK(0, 0, 0, 100)
  black: '#000000'
};

// Business card dimensions in points (1 point = 1/72 inch)
export const CARD_DIMENSIONS = {
  // Final size: 89mm × 50mm
  width: 252.28, // 89mm in points
  height: 141.73, // 50mm in points
  // With 3mm bleed: 95mm × 56mm
  bleedWidth: 269.29, // 95mm in points
  bleedHeight: 158.74, // 56mm in points
  bleed: 8.5 // 3mm in points
};

export interface PDFGeneratorOptions {
  includeBleed?: boolean;
  design: 'design1' | 'design2';
  dpi?: number;
}

export class PDFGenerator {
  private doc: any;
  private options: PDFGeneratorOptions;

  constructor(options: PDFGeneratorOptions = { design: 'design1' }) {
    this.options = {
      includeBleed: false,
      dpi: 300,
      ...options
    };

    // Create PDF document with proper settings for print
    this.doc = new PDFDocument({
      size: this.options.includeBleed 
        ? [CARD_DIMENSIONS.bleedWidth, CARD_DIMENSIONS.bleedHeight]
        : [CARD_DIMENSIONS.width, CARD_DIMENSIONS.height],
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      info: {
        Title: 'CBRE Business Card',
        Author: 'CBRE Business Card Generator',
        Creator: 'CBRE Business Card Generator',
        Producer: 'PDFKit',
        CreationDate: new Date()
      },
      // Disable font embedding to avoid font loading issues
      pdfVersion: '1.4'
    });

    // Set up for high-quality print output
    this.setupPrintSettings();
  }

  private setupPrintSettings(): void {
    // Add metadata for print production
    this.doc.info.Subject = 'Business Card - Print Ready';
    this.doc.info.Keywords = 'business card, CBRE, print ready, CMYK';
    
    // Note: PDFKit doesn't support CMYK natively, but we use RGB values
    // that closely match our CMYK requirements. A print service can
    // convert to CMYK profile during final processing.
  }

  // Generate front side of business card
  generateFront(data: BusinessCardData): PDFGenerator {
    // Create new page for front
    this.doc.addPage();
    
    if (this.options.design === 'design1') {
      this.generateDesign1Front(data);
    } else {
      this.generateDesign2Front(data);
    }

    return this;
  }

  // Generate back side of business card
  generateBack(data: BusinessCardData): PDFGenerator {
    // Create new page for back
    this.doc.addPage();
    this.generateBackDesign(data);
    return this;
  }

  private generateDesign1Front(data: BusinessCardData): void {
    const { width, height } = this.options.includeBleed 
      ? { width: CARD_DIMENSIONS.bleedWidth, height: CARD_DIMENSIONS.bleedHeight }
      : { width: CARD_DIMENSIONS.width, height: CARD_DIMENSIONS.height };

    // Left green block (40% of card width)
    const greenBlockWidth = width * 0.4;
    
    this.doc
      .rect(0, 0, greenBlockWidth, height)
      .fill(CBRE_COLORS.green);

    // White background for the rest
    this.doc
      .rect(greenBlockWidth, 0, width - greenBlockWidth, height)
      .fill(CBRE_COLORS.white);

    // Add content sections
    this.addDesign1Content(data, greenBlockWidth, width, height);
  }

  private generateDesign2Front(data: BusinessCardData): void {
    const { width, height } = this.options.includeBleed 
      ? { width: CARD_DIMENSIONS.bleedWidth, height: CARD_DIMENSIONS.bleedHeight }
      : { width: CARD_DIMENSIONS.width, height: CARD_DIMENSIONS.height };

    // Full white background
    this.doc
      .rect(0, 0, width, height)
      .fill(CBRE_COLORS.white);

    // Green accent stripe (top)
    const stripeHeight = height * 0.15;
    this.doc
      .rect(0, 0, width, stripeHeight)
      .fill(CBRE_COLORS.green);

    // Add content sections
    this.addDesign2Content(data, width, height, stripeHeight);
  }

  private generateBackDesign(data: BusinessCardData): void {
    const { width, height } = this.options.includeBleed 
      ? { width: CARD_DIMENSIONS.bleedWidth, height: CARD_DIMENSIONS.bleedHeight }
      : { width: CARD_DIMENSIONS.width, height: CARD_DIMENSIONS.height };

    // Full green background
    this.doc
      .rect(0, 0, width, height)
      .fill(CBRE_COLORS.green);

    // Add back content
    this.addBackContent(data, width, height);
  }

  private addDesign1Content(data: BusinessCardData, greenBlockWidth: number, width: number, height: number): void {
    // Use built-in fonts to avoid font file issues
    this.doc
      .font('Helvetica-Bold')
      .fillColor(CBRE_COLORS.white)
      .fontSize(12)
      .text('CBRE', greenBlockWidth - 60, 20);

    this.doc
      .font('Helvetica')
      .fillColor(CBRE_COLORS.darkGrey)
      .fontSize(14)
      .text(data.fullName, greenBlockWidth + 10, 30);

    // Add title
    this.doc
      .font('Helvetica')
      .fillColor(CBRE_COLORS.darkGrey)
      .fontSize(10)
      .text(data.title, greenBlockWidth + 10, 50);

    // Add contact information
    this.doc
      .font('Helvetica')
      .fillColor(CBRE_COLORS.darkGrey)
      .fontSize(8)
      .text(data.email, greenBlockWidth + 10, 70)
      .text(data.telephone, greenBlockWidth + 10, 85)
      .text(data.mobile, greenBlockWidth + 10, 100);
  }

  private addDesign2Content(data: BusinessCardData, width: number, height: number, stripeHeight: number): void {
    // Use built-in fonts to avoid font file issues
    this.doc
      .font('Helvetica-Bold')
      .fillColor(CBRE_COLORS.white)
      .fontSize(12)
      .text('CBRE', 10, 10);

    this.doc
      .font('Helvetica')
      .fillColor(CBRE_COLORS.darkGrey)
      .fontSize(14)
      .text(data.fullName, 10, stripeHeight + 20);

    // Add title
    this.doc
      .font('Helvetica')
      .fillColor(CBRE_COLORS.darkGrey)
      .fontSize(10)
      .text(data.title, 10, stripeHeight + 40);

    // Add contact information
    this.doc
      .font('Helvetica')
      .fillColor(CBRE_COLORS.darkGrey)
      .fontSize(8)
      .text(data.email, 10, stripeHeight + 60)
      .text(data.telephone, 10, stripeHeight + 75)
      .text(data.mobile, 10, stripeHeight + 90);
  }

  private addBackContent(data: BusinessCardData, width: number, height: number): void {
    // Use built-in fonts to avoid font file issues
    this.doc
      .font('Helvetica-Bold')
      .fillColor(CBRE_COLORS.white)
      .fontSize(16)
      .text('CBRE', width / 2, height / 2, { align: 'center' });

    // Add office information
    this.doc
      .font('Helvetica')
      .fillColor(CBRE_COLORS.white)
      .fontSize(8)
      .text(data.officeName, width / 2, height / 2 + 20, { align: 'center' });
  }

  // Generate PDF buffer
  getBuffer(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      
      this.doc.on('data', (chunk: Buffer) => {
        buffers.push(chunk);
      });
      
      this.doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      
      this.doc.on('error', reject);
      
      this.doc.end();
    });
  }

  // Get PDF stream
  getStream(): any {
    return this.doc;
  }
} 