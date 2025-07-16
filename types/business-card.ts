export interface BusinessCardData {
  fullName: string;
  title: string;
  licenseNumber?: string;
  officeName: string;
  officeAddress: string;
  email: string;
  telephone: string;
  mobile: string;
}

export interface BusinessCardFormData extends BusinessCardData {
  includeBleed: boolean;
}

export interface CSVRow extends BusinessCardData {
  'Full Name': string;
  'Title': string;
  'License Number': string;
  'Office Name': string;
  'Office Address': string;
  'Email': string;
  'Telephone': string;
  'Mobile': string;
}

export interface PDFGenerationOptions {
  includeBleed: boolean;
}

export interface GeneratedFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface BatchGenerationResult {
  success: boolean;
  files: GeneratedFile[];
  zipFile?: GeneratedFile;
  errors?: string[];
}

export interface CMYKColor {
  c: number; // Cyan (0-100)
  m: number; // Magenta (0-100)
  y: number; // Yellow (0-100)
  k: number; // Black (0-100)
}

export interface CardDimensions {
  width: number;  // mm
  height: number; // mm
  bleed: number;  // mm
}

export interface FontConfig {
  name: string;
  path: string;
  family: string;
}

export interface ColorPalette {
  cbreGreen: CMYKColor;
  darkGreen: CMYKColor;
  darkGrey: CMYKColor;
  white: CMYKColor;
}

export interface DesignLayout {
  front: {
    logo: { x: number; y: number; width: number; height: number };
    nameText: { x: number; y: number; maxWidth: number };
    titleText: { x: number; y: number; maxWidth: number };
    licenseText: { x: number; y: number; maxWidth: number };
    officeText: { x: number; y: number; maxWidth: number };
    contactText: { x: number; y: number; maxWidth: number };
    leftBlock: { x: number; y: number; width: number; height: number };
  };
  back: {
    background: { color: CMYKColor };
    recycleIcon: { x: number; y: number; width: number; height: number };
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CSVValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data?: BusinessCardData[];
  rowCount?: number;
} 