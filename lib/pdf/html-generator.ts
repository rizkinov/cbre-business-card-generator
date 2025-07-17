import puppeteer from 'puppeteer';
import { BusinessCardData } from '../../types/business-card';
import chromium from '@sparticuz/chromium';
import { escapeHtmlPreservingLineBreaks } from '../../utils/text-processing';

// CMYK to RGB conversion (same as before)
export const CBRE_COLORS = {
  green: '#1E5A41',
  darkGreen: '#1A3D32',
  darkGrey: '#4A4A4A',
  white: '#FFFFFF',
  black: '#000000'
};

// Business card dimensions in mm
export const CARD_DIMENSIONS = {
  width: 89, // mm
  height: 50, // mm
  bleedWidth: 95, // mm
  bleedHeight: 56, // mm
  bleed: 3 // mm
};

export interface HTMLPDFGeneratorOptions {
  includeBleed?: boolean;
}

export class HTMLPDFGenerator {
  private options: HTMLPDFGeneratorOptions;

  constructor(options: HTMLPDFGeneratorOptions = { includeBleed: false }) {
    this.options = {
      includeBleed: false,
      ...options
    };
  }

  private generateHTML(data: BusinessCardData): string {
    const { width, height } = this.options.includeBleed 
      ? { width: CARD_DIMENSIONS.bleedWidth, height: CARD_DIMENSIONS.bleedHeight }
      : { width: CARD_DIMENSIONS.width, height: CARD_DIMENSIONS.height };

    const frontHTML = this.generateFrontHTML(data, width, height);
    const backHTML = this.generateBackHTML(data, width, height);

    // Use absolute URLs for production, relative for development
    const isProduction = process.env.NODE_ENV === 'production';
    const fontBaseUrl = isProduction ? 'https://cbre-business-card.vercel.app' : '';
    
    // Green stripe width: 3mm normal, 6mm with bleed (extends 3mm left into bleed area)
    const greenStripeWidth = this.options.includeBleed ? '6mm' : '3mm';
    
    // Content positioning: shift 3mm inward when bleed is enabled to maintain original design
    const bleedOffset = this.options.includeBleed ? 3 : 0;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            /* Import Google Fonts for better consistency */
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
            
            /* Custom font loading with better fallbacks */
            @font-face {
              font-family: 'Financier Display';
              src: url('${fontBaseUrl}/fonts/financier_display/financier-display-web-regular.woff2') format('woff2'),
                   url('${fontBaseUrl}/fonts/financier_display/financier-display-web-regular.woff') format('woff');
              font-weight: 400;
              font-style: normal;
              font-display: block;
            }
            
            @font-face {
              font-family: 'Financier Display';
              src: url('${fontBaseUrl}/fonts/financier_display/financier-display-web-medium.woff2') format('woff2'),
                   url('${fontBaseUrl}/fonts/financier_display/financier-display-web-medium.woff') format('woff');
              font-weight: 500;
              font-style: normal;
              font-display: block;
            }
            
            @font-face {
              font-family: 'Calibre';
              src: url('${fontBaseUrl}/fonts/calibre/calibre-web-light.woff2') format('woff2'),
                   url('${fontBaseUrl}/fonts/calibre/calibre-web-light.woff') format('woff');
              font-weight: 300;
              font-style: normal;
              font-display: block;
            }
            
            @font-face {
              font-family: 'Calibre';
              src: url('${fontBaseUrl}/fonts/calibre/calibre-web-regular.woff2') format('woff2'),
                   url('${fontBaseUrl}/fonts/calibre/calibre-web-regular.woff') format('woff');
              font-weight: 400;
              font-style: normal;
              font-display: block;
            }
            
            @page {
              size: ${width}mm ${height}mm;
              margin: 0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: ${width}mm;
              height: ${height * 2}mm;
              font-family: 'Calibre', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              font-weight: 300;
              background-color: #f8f8f8;
              overflow: hidden;
            }
            
            .card-table {
              width: 100%;
              height: ${height}mm;
              border-collapse: collapse;
              table-layout: fixed;
              position: relative;
            }
            
            .green-stripe {
              width: ${greenStripeWidth};
              background-color: #f8f8f8;
              padding: 0;
              vertical-align: top;
              position: relative;
            }
            
            .green-bar {
              position: absolute;
              top: ${8 + bleedOffset}mm;
              bottom: ${8 + bleedOffset}mm;
              left: 0;
              right: 0;
              background-color: #003F2D;
            }
            
            .main-content {
              background-color: #f8f8f8;
              vertical-align: top;
              padding: ${8 + bleedOffset}mm 0 0 ${3 + bleedOffset}mm;
              position: relative;
              width: 51mm;
            }
            
            .logo-contact {
              width: 35mm;
              background-color: #f8f8f8;
              vertical-align: top;
              padding: ${8 + bleedOffset}mm ${5 + bleedOffset}mm ${4 + bleedOffset}mm 4mm;
              position: relative;
            }
            
            .name {
              font-family: 'Financier Display', 'Playfair Display', Georgia, 'Times New Roman', serif;
              font-size: 16pt;
              font-weight: 400;
              color: #012A2D;
              margin-bottom: 1mm;
              line-height: 1.2;
            }
            
            .title-license {
              font-family: 'Calibre', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              font-weight: 300;
              font-size: 7pt;
              color: #435254;
              margin-bottom: 6mm;
              line-height: 1.2;
            }
            
            .company-info {
              font-family: 'Calibre', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              font-weight: 300;
              font-size: 7pt;
              color: #435254;
              line-height: 1.2;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            .company-name {
              font-weight: 400;
              margin-bottom: 1mm;
            }
            
            .address {
              max-width: 45mm;
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
            }
            
            .website {
              font-family: 'Calibre', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              font-weight: 300;
              font-size: 7pt;
              color: #435254;
              position: absolute;
              bottom: ${8 + bleedOffset}mm;
              left: ${3 + bleedOffset}mm;
            }
            
            .logo {
              position: absolute;
              top: ${8 + bleedOffset}mm;
              right: ${5 + bleedOffset}mm;
              margin-bottom: 6mm;
            }
            
            .logo svg {
              width: auto;
              height: 6mm;
              fill: #003F2D;
            }
            
            .contact-info {
              text-align: right;
              font-family: 'Calibre', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              font-weight: 300;
              font-size: 7pt;
              color: #435254;
              line-height: 1.1;
              white-space: nowrap;
              position: absolute;
              bottom: ${8 + bleedOffset}mm;
              right: ${5 + bleedOffset}mm;
            }
            
            .contact-info div {
              margin-bottom: 0.8mm;
            }
            
            .contact-info div:last-child {
              margin-bottom: 0;
            }
            
            .recycle-icon {
              width: 8mm;
              height: 8mm;
              fill: rgba(255, 255, 255, 0.3);
              position: absolute;
              bottom: 5mm;
              right: 5mm;
            }
            
            .green-block {
              background-color: ${CBRE_COLORS.green};
              position: absolute;
            }
            
            .text-white {
              color: ${CBRE_COLORS.white};
            }
            
            .text-center {
              text-align: center;
            }
            
            /* Crop marks - only visible when bleed is enabled */
            .crop-marks {
              display: ${this.options.includeBleed ? 'block' : 'none'};
            }
            
            /* Front crop marks (dark grey on white background) */
            .crop-mark-front {
              position: absolute;
              border: 0.1pt solid rgba(0, 0, 0, 0.4);
            }
            
            /* Back crop marks (light grey on green background) */
            .crop-mark-back {
              position: absolute;
              border: 0.1pt solid rgba(255, 255, 255, 0.3);
            }
            
            /* Top-left corner - extends UP and LEFT toward corner */
            .crop-mark-front.crop-mark-top-left {
              top: 3mm;
              left: 3mm;
              width: 3mm;
              height: 0;
              border-top: 0.1pt solid rgba(0, 0, 0, 0.4);
              border-right: none;
              border-bottom: none;
              border-left: none;
            }
            
            .crop-mark-back.crop-mark-top-left {
              top: 3mm;
              left: 3mm;
              width: 3mm;
              height: 0;
              border-top: 0.1pt solid rgba(255, 255, 255, 0.3);
              border-right: none;
              border-bottom: none;
              border-left: none;
            }
            
            .crop-mark-front.crop-mark-top-left::after {
              content: '';
              position: absolute;
              top: -0.05pt;
              left: -0.05pt;
              width: 0;
              height: 3mm;
              border-left: 0.1pt solid rgba(0, 0, 0, 0.4);
            }
            
            .crop-mark-back.crop-mark-top-left::after {
              content: '';
              position: absolute;
              top: -0.05pt;
              left: -0.05pt;
              width: 0;
              height: 3mm;
              border-left: 0.1pt solid rgba(255, 255, 255, 0.3);
            }
            
            /* Top-right corner - extends UP and RIGHT toward corner */
            .crop-mark-front.crop-mark-top-right {
              top: 3mm;
              right: 3mm;
              width: 3mm;
              height: 0;
              border-top: 0.1pt solid rgba(0, 0, 0, 0.4);
              border-right: none;
              border-bottom: none;
              border-left: none;
              transform: translateX(3mm);
            }
            
            .crop-mark-back.crop-mark-top-right {
              top: 3mm;
              right: 3mm;
              width: 3mm;
              height: 0;
              border-top: 0.1pt solid rgba(255, 255, 255, 0.3);
              border-right: none;
              border-bottom: none;
              border-left: none;
              transform: translateX(3mm);
            }
            
            .crop-mark-front.crop-mark-top-right::after {
              content: '';
              position: absolute;
              top: -0.05pt;
              right: -0.05pt;
              width: 0;
              height: 3mm;
              border-right: 0.1pt solid rgba(0, 0, 0, 0.4);
            }
            
            .crop-mark-back.crop-mark-top-right::after {
              content: '';
              position: absolute;
              top: -0.05pt;
              right: -0.05pt;
              width: 0;
              height: 3mm;
              border-right: 0.1pt solid rgba(255, 255, 255, 0.3);
            }
            
            /* Bottom-left corner - extends DOWN and LEFT toward corner */
            .crop-mark-front.crop-mark-bottom-left {
              bottom: 3mm;
              left: 3mm;
              width: 3mm;
              height: 0;
              border-bottom: 0.1pt solid rgba(0, 0, 0, 0.4);
              border-right: none;
              border-top: none;
              border-left: none;
            }
            
            .crop-mark-back.crop-mark-bottom-left {
              bottom: 3mm;
              left: 3mm;
              width: 3mm;
              height: 0;
              border-bottom: 0.1pt solid rgba(255, 255, 255, 0.3);
              border-right: none;
              border-top: none;
              border-left: none;
            }
            
            .crop-mark-front.crop-mark-bottom-left::after {
              content: '';
              position: absolute;
              bottom: -0.05pt;
              left: -0.05pt;
              width: 0;
              height: 3mm;
              border-left: 0.1pt solid rgba(0, 0, 0, 0.4);
              transform: translateY(-3mm);
            }
            
            .crop-mark-back.crop-mark-bottom-left::after {
              content: '';
              position: absolute;
              bottom: -0.05pt;
              left: -0.05pt;
              width: 0;
              height: 3mm;
              border-left: 0.1pt solid rgba(255, 255, 255, 0.3);
              transform: translateY(-3mm);
            }
            
            /* Bottom-right corner - extends DOWN and RIGHT toward corner */
            .crop-mark-front.crop-mark-bottom-right {
              bottom: 3mm;
              right: 3mm;
              width: 3mm;
              height: 0;
              border-bottom: 0.1pt solid rgba(0, 0, 0, 0.4);
              border-right: none;
              border-top: none;
              border-left: none;
              transform: translateX(3mm);
            }
            
            .crop-mark-back.crop-mark-bottom-right {
              bottom: 3mm;
              right: 3mm;
              width: 3mm;
              height: 0;
              border-bottom: 0.1pt solid rgba(255, 255, 255, 0.3);
              border-right: none;
              border-top: none;
              border-left: none;
              transform: translateX(3mm);
            }
            
            .crop-mark-front.crop-mark-bottom-right::after {
              content: '';
              position: absolute;
              bottom: -0.05pt;
              right: -0.05pt;
              width: 0;
              height: 3mm;
              border-right: 0.1pt solid rgba(0, 0, 0, 0.4);
              transform: translateY(-3mm);
            }
            
            .crop-mark-back.crop-mark-bottom-right::after {
              content: '';
              position: absolute;
              bottom: -0.05pt;
              right: -0.05pt;
              width: 0;
              height: 3mm;
              border-right: 0.1pt solid rgba(255, 255, 255, 0.3);
              transform: translateY(-3mm);
            }
          </style>
        </head>
        <body>
          <div style="width: ${width}mm; height: ${height}mm; margin: 0; padding: 0; position: relative; page-break-after: always;">
            ${frontHTML}
            <!-- Crop marks for professional printing (front side) -->
            <div class="crop-marks">
              <div class="crop-mark-front crop-mark-top-left"></div>
              <div class="crop-mark-front crop-mark-top-right"></div>
              <div class="crop-mark-front crop-mark-bottom-left"></div>
              <div class="crop-mark-front crop-mark-bottom-right"></div>
            </div>
          </div>
          <div style="width: ${width}mm; height: ${height}mm; margin: 0; padding: 0; position: relative; overflow: visible;">
            ${backHTML}
            <!-- Crop marks for professional printing (back side) -->
            <div class="crop-marks">
              <div class="crop-mark-back crop-mark-top-left"></div>
              <div class="crop-mark-back crop-mark-top-right"></div>
              <div class="crop-mark-back crop-mark-bottom-left"></div>
              <div class="crop-mark-back crop-mark-bottom-right"></div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateFrontHTML(data: BusinessCardData, width: number, height: number): string {
    return `
      <table class="card-table">
        <tr>
          <td class="green-stripe">
            <div class="green-bar"></div>
          </td>
          <td class="main-content">
            <div class="name">${escapeHtmlPreservingLineBreaks(data.fullName)}</div>
            <div class="title-license">
              <div>${escapeHtmlPreservingLineBreaks(data.title)}</div>
              ${data.licenseNumber ? `<div>Lic no. ${escapeHtmlPreservingLineBreaks(data.licenseNumber)}</div>` : ''}
            </div>
            <div class="company-info">
              <div class="company-name">${escapeHtmlPreservingLineBreaks(data.officeName)}</div>
              <div class="address">${escapeHtmlPreservingLineBreaks(data.officeAddress)}</div>
            </div>
            <div class="website">cbre.com</div>
          </td>
          <td class="logo-contact">
            <div class="logo">
              <svg viewBox="0 0 81 20.13" xmlns="http://www.w3.org/2000/svg">
                <path d="M33.57,15.41H26.89V12.05h6.86a1.66,1.66,0,0,1,1.49,1.64,1.73,1.73,0,0,1-1.67,1.72m-6.68-11h7A1.64,1.64,0,0,1,35.3,6a1.72,1.72,0,0,1-1.43,1.68h-7Zm9.94,5.37c2.56-.85,3-3,3-4.75,0-2.68-1.89-5-7.48-5H21.94V20.09h10.4C38,20.09,40,17.21,40,14.32a4.91,4.91,0,0,0-3.19-4.58M63.37,0V20.13H81V15.54H68.28V12H79.75V7.63H68.28V4.39H81V0ZM55.79,6.26a1.65,1.65,0,0,1-1.57,1.38H47.34V4.43h6.88a1.57,1.57,0,0,1,1.57,1.4ZM53.12,0H42.47v20.1h4.89V12h5.39a2.8,2.8,0,0,1,2.74,2.85v5.27h4.79V13.62a4.21,4.21,0,0,0-2.9-3.89,4.5,4.5,0,0,0,3-4.44C60.34.94,56.6,0,53.12,0M18.76,15.27c-.07,0-6.69.13-9-.09a5.16,5.16,0,0,1-5-5.31,5.14,5.14,0,0,1,4.82-5.2c1.39-.19,9-.1,9.09-.1h.16L18.9,0h-.16L10.11,0A12.73,12.73,0,0,0,5.93.84A10.25,10.25,0,0,0,2,4a10,10,0,0,0-2,6,12.15,12.15,0,0,0,.16,2A9.8,9.8,0,0,0,5.65,19a14.72,14.72,0,0,0,5.46,1.11l1.63,0h6.17V15.27Z"/>
              </svg>
            </div>
            <div class="contact-info">
              <div>${escapeHtmlPreservingLineBreaks(data.email)}</div>
              <div>T ${escapeHtmlPreservingLineBreaks(data.telephone)}</div>
              <div>M ${escapeHtmlPreservingLineBreaks(data.mobile)}</div>
            </div>
          </td>
        </tr>
      </table>
    `;
  }

  private generateDesign2Front(data: BusinessCardData, width: number, height: number): string {
    return `
      <table class="card-table">
        <tr>
          <td class="green-stripe">
            <div class="green-bar"></div>
          </td>
          <td class="main-content">
            <div class="name">${escapeHtmlPreservingLineBreaks(data.fullName)}</div>
            <div class="title-license">
              <div>${escapeHtmlPreservingLineBreaks(data.title)}</div>
              ${data.licenseNumber ? `<div>Lic no. ${escapeHtmlPreservingLineBreaks(data.licenseNumber)}</div>` : ''}
            </div>
            <div class="company-info">
              <div class="company-name">${escapeHtmlPreservingLineBreaks(data.officeName)}</div>
              <div class="address">${escapeHtmlPreservingLineBreaks(data.officeAddress)}</div>
            </div>
            <div class="website">cbre.com</div>
          </td>
          <td class="logo-contact">
            <div class="logo">
              <svg viewBox="0 0 81 20.13" xmlns="http://www.w3.org/2000/svg">
                <path d="M33.57,15.41H26.89V12.05h6.86a1.66,1.66,0,0,1,1.49,1.64,1.73,1.73,0,0,1-1.67,1.72m-6.68-11h7A1.64,1.64,0,0,1,35.3,6a1.72,1.72,0,0,1-1.43,1.68h-7Zm9.94,5.37c2.56-.85,3-3,3-4.75,0-2.68-1.89-5-7.48-5H21.94V20.09h10.4C38,20.09,40,17.21,40,14.32a4.91,4.91,0,0,0-3.19-4.58M63.37,0V20.13H81V15.54H68.28V12H79.75V7.63H68.28V4.39H81V0ZM55.79,6.26a1.65,1.65,0,0,1-1.57,1.38H47.34V4.43h6.88a1.57,1.57,0,0,1,1.57,1.4ZM53.12,0H42.47v20.1h4.89V12h5.39a2.8,2.8,0,0,1,2.74,2.85v5.27h4.79V13.62a4.21,4.21,0,0,0-2.9-3.89,4.5,4.5,0,0,0,3-4.44C60.34.94,56.6,0,53.12,0M18.76,15.27c-.07,0-6.69.13-9-.09a5.16,5.16,0,0,1-5-5.31,5.14,5.14,0,0,1,4.82-5.2c1.39-.19,9-.1,9.09-.1h.16L18.9,0h-.16L10.11,0A12.73,12.73,0,0,0,5.93.84,10.25,10.25,0,0,0,2,4a10,10,0,0,0-2,6,12.15,12.15,0,0,0,.16,2A9.8,9.8,0,0,0,5.65,19a14.72,14.72,0,0,0,5.46,1.11l1.63,0h6.17V15.27Z"/>
              </svg>
            </div>
            <div class="contact-info">
              <div>${escapeHtmlPreservingLineBreaks(data.email)}</div>
              <div>T ${escapeHtmlPreservingLineBreaks(data.telephone)}</div>
              <div>M ${escapeHtmlPreservingLineBreaks(data.mobile)}</div>
            </div>
          </td>
        </tr>
      </table>
    `;
  }

  private generateBackHTML(data: BusinessCardData, width: number, height: number): string {
    const cardWidth = this.options.includeBleed ? CARD_DIMENSIONS.bleedWidth : CARD_DIMENSIONS.width;
    const cardHeight = this.options.includeBleed ? CARD_DIMENSIONS.bleedHeight : CARD_DIMENSIONS.height;
    const bleedOffset = this.options.includeBleed ? 3 : 0;
    
    return `
      <div style="width: ${cardWidth}mm; height: ${cardHeight}mm; background-color: #003F2D; position: relative; margin: 0; padding: 0; box-sizing: border-box;">
        <!-- Recycle Icon -->
        <svg style="width: 6mm; height: 6mm; fill: rgba(255, 255, 255, 0.5); position: absolute; bottom: ${5 + bleedOffset}mm; right: ${5 + bleedOffset}mm;" viewBox="0 -8 72 72" xmlns="http://www.w3.org/2000/svg">
          <path d="M24.42,30.55,27,32.1c.42,0,.64-.18.64-.53a2.3,2.3,0,0,0-.3-.94l-5.6-10.51-12.39.3a.78.78,0,0,0-.84.87c0,.13.18.3.53.53l2.57,1.55L8.84,27.6a6.15,6.15,0,0,0-1.13,3A4.91,4.91,0,0,0,8.46,33l8.43,14.7a12.58,12.58,0,0,1-.3-2.64A8,8,0,0,1,18,40.64l6.43-10.09Z"/>
          <path d="M27.67,22,34.62,11.2q-3.9-8.88-8.28-8.88c-1.76,0-2.94.49-3.55,1.47L16.21,14.3,27.67,22Z"/>
          <path d="M22,51.15H35.41V37.2H22.49a47.41,47.41,0,0,0-3,4.61,8.66,8.66,0,0,0-1,3.93q0,5.41,3.48,5.41Z"/>
          <path d="M49.63,19.4l6-10a2.22,2.22,0,0,0,.3-1.1c0-.45-.15-.68-.45-.68a2.53,2.53,0,0,1-.61.23L52.12,9,49.63,4.09Q48,.77,43,.77H27.44a12.15,12.15,0,0,1,3.85,1.7q2.39,1.89,4.88,7.1l3.1,6.5L37,17.17a.6.6,0,0,0-.34.61c0,.37.24.59.72.64l12.29,1Z"/>
          <path d="M55.6,49.07l8.69-15.8a9.69,9.69,0,0,1-4.19,2.95,17.27,17.27,0,0,1-5.18.61H45.24v-2q0-1.17-.57-1.17a.65.65,0,0,0-.6.3L38,44.57l6.35,9.76c.48.73.89,1,1.24.86s.53-.28.53-.56V51.3h5.37a4.33,4.33,0,0,0,4.16-2.23Z"/>
          <path d="M51.82,34.82H57.6A6.91,6.91,0,0,0,61.91,33q2.39-1.89,2.38-4a3.47,3.47,0,0,0-.64-1.93l-6.88-10.5L44.94,23.45l6.88,11.37Z"/>
        </svg>
      </div>
    `;
  }

  async generatePDF(data: BusinessCardData): Promise<Buffer> {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const browser = await puppeteer.launch({
      args: isProduction ? chromium.args : [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      executablePath: isProduction ? await chromium.executablePath() : undefined,
      headless: true
    });
    
    try {
      const page = await browser.newPage();
      const html = this.generateHTML(data);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Wait for fonts to load with longer timeout
      await page.evaluateHandle('document.fonts.ready');
      
      // Additional wait to ensure fonts are fully loaded
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Force font check
      await page.evaluate(() => {
        return new Promise((resolve) => {
          if (document.fonts.ready) {
            document.fonts.ready.then(() => {
              // Check if custom fonts are actually loaded
              const fontFaces = Array.from(document.fonts);
              const customFonts = fontFaces.filter(font => 
                font.family.includes('Financier Display') || 
                font.family.includes('Calibre')
              );
              console.log('Custom fonts loaded:', customFonts.length);
              setTimeout(resolve, 500);
            });
          } else {
            setTimeout(resolve, 1000);
          }
        });
      });
      
      const { width, height } = this.options.includeBleed 
        ? { width: CARD_DIMENSIONS.bleedWidth, height: CARD_DIMENSIONS.bleedHeight }
        : { width: CARD_DIMENSIONS.width, height: CARD_DIMENSIONS.height };
      
      const pdfBuffer = await page.pdf({
        width: `${width}mm`,
        height: `${height}mm`, // Single business card height per page
        printBackground: true,
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      });
       
       return Buffer.from(pdfBuffer);
      
    } finally {
      await browser.close();
    }
  }
} 