import { CardDimensions, ColorPalette, FontConfig } from '../types/business-card';

// Card dimensions in mm
export const CARD_DIMENSIONS: CardDimensions = {
  width: 89,
  height: 50,
  bleed: 3
};

// CMYK color palette
export const COLORS: ColorPalette = {
  cbreGreen: { c: 90, m: 46, y: 80, k: 55 },
  darkGreen: { c: 91, m: 62, y: 62, k: 65 },
  darkGrey: { c: 73, m: 55, y: 55, k: 33 },
  white: { c: 0, m: 0, y: 0, k: 0 }
};

// Font configurations
export const FONTS: FontConfig[] = [
  {
    name: 'Financier Display',
    path: '/fonts/financier-display.otf',
    family: 'FinancierDisplay'
  },
  {
    name: 'Calibre',
    path: '/fonts/calibre.otf',
    family: 'Calibre'
  }
];

// PDF generation settings
export const PDF_SETTINGS = {
  dpi: 300,
  colorSpace: 'CMYK',
  compression: false,
  embedFonts: true
};

// File settings
export const FILE_SETTINGS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['text/csv', 'application/csv'],
  maxEntries: 20
};

// Form validation rules
export const VALIDATION_RULES = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  title: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  licenseNumber: {
    required: false,
    maxLength: 20
  },
  officeName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  officeAddress: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  telephone: {
    required: true,
    minLength: 8,
    maxLength: 20
  },
  mobile: {
    required: true,
    minLength: 8,
    maxLength: 20
  }
};

// CSV column mappings
export const CSV_COLUMNS = [
  'Full Name',
  'Title',
  'License Number',
  'Office Name',
  'Office Address',
  'Email',
  'Telephone',
  'Mobile'
];

// API endpoints
export const API_ENDPOINTS = {
  generatePDF: '/api/generate-pdf',
  generateBatch: '/api/generate-batch-pdf',
  downloadFile: '/api/download',
  csvTemplate: '/api/template/csv'
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CSV_FORMAT: 'Invalid CSV format. Please check the template.',
  TOO_MANY_ENTRIES: `Maximum ${FILE_SETTINGS.maxEntries} entries allowed.`,
  MISSING_REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  FILE_TOO_LARGE: `File size must be less than ${FILE_SETTINGS.maxFileSize / 1024 / 1024}MB.`,
  INVALID_FILE_TYPE: 'Please upload a valid CSV file.',
  GENERATION_FAILED: 'PDF generation failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.'
}; 