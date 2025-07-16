import { z } from 'zod';
import { VALIDATION_RULES, CSV_COLUMNS, FILE_SETTINGS } from './constants';
import { BusinessCardData, CSVValidationResult, ValidationError } from '../types/business-card';

// Zod schema for business card data
export const businessCardSchema = z.object({
  fullName: z.string()
    .min(VALIDATION_RULES.fullName.minLength, 'Name must be at least 2 characters')
    .max(VALIDATION_RULES.fullName.maxLength, 'Name must be less than 50 characters')
    .trim(),
  
  title: z.string()
    .min(VALIDATION_RULES.title.minLength, 'Title must be at least 2 characters')
    .max(VALIDATION_RULES.title.maxLength, 'Title must be less than 100 characters')
    .trim(),
  
  licenseNumber: z.string()
    .max(VALIDATION_RULES.licenseNumber.maxLength, 'License number must be less than 20 characters')
    .optional(),
  
  officeName: z.string()
    .min(VALIDATION_RULES.officeName.minLength, 'Office name must be at least 2 characters')
    .max(VALIDATION_RULES.officeName.maxLength, 'Office name must be less than 100 characters')
    .trim(),
  
  officeAddress: z.string()
    .min(VALIDATION_RULES.officeAddress.minLength, 'Address must be at least 10 characters')
    .max(VALIDATION_RULES.officeAddress.maxLength, 'Address must be less than 500 characters')
    .trim(),
  
  email: z.string()
    .email('Please enter a valid email address')
    .trim(),
  
  telephone: z.string()
    .min(VALIDATION_RULES.telephone.minLength, 'Telephone must be at least 8 characters')
    .max(VALIDATION_RULES.telephone.maxLength, 'Telephone must be less than 20 characters')
    .trim(),
  
  mobile: z.string()
    .min(VALIDATION_RULES.mobile.minLength, 'Mobile must be at least 8 characters')
    .max(VALIDATION_RULES.mobile.maxLength, 'Mobile must be less than 20 characters')
    .trim(),
});

// Schema for form data (includes bleed option)
export const businessCardFormSchema = businessCardSchema.extend({
  includeBleed: z.boolean().default(false)
});

/**
 * Validate a single business card data object
 */
export function validateBusinessCard(data: unknown): { isValid: boolean; errors: ValidationError[]; data?: BusinessCardData } {
  try {
    const validatedData = businessCardSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return {
        isValid: false,
        errors
      };
    }
    return {
      isValid: false,
      errors: [{ field: 'general', message: 'Validation failed' }]
    };
  }
}

/**
 * Validate CSV data structure
 */
export function validateCSVStructure(headers: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const missingColumns = CSV_COLUMNS.filter(col => !headers.includes(col));
  
  if (missingColumns.length > 0) {
    errors.push({
      field: 'headers',
      message: `Missing required columns: ${missingColumns.join(', ')}`
    });
  }
  
  const extraColumns = headers.filter(header => !CSV_COLUMNS.includes(header));
  if (extraColumns.length > 0) {
    errors.push({
      field: 'headers',
      message: `Unexpected columns: ${extraColumns.join(', ')}`
    });
  }
  
  return errors;
}

/**
 * Convert CSV row to BusinessCardData
 */
export function csvRowToBusinessCardData(row: Record<string, unknown>): BusinessCardData {
  return {
    fullName: String(row['Full Name'] || ''),
    title: String(row['Title'] || ''),
    licenseNumber: String(row['License Number'] || ''),
    officeName: String(row['Office Name'] || ''),
    officeAddress: String(row['Office Address'] || ''),
    email: String(row['Email'] || ''),
    telephone: String(row['Telephone'] || ''),
    mobile: String(row['Mobile'] || ''),
  };
}

/**
 * Validate CSV data
 */
export function validateCSVData(csvData: unknown[]): CSVValidationResult {
  const errors: ValidationError[] = [];
  const validData: BusinessCardData[] = [];
  
  // Check row count
  if (csvData.length === 0) {
    return {
      isValid: false,
      errors: [{ field: 'general', message: 'CSV file is empty' }]
    };
  }
  
  if (csvData.length > FILE_SETTINGS.maxEntries) {
    return {
      isValid: false,
      errors: [{ field: 'general', message: `Maximum ${FILE_SETTINGS.maxEntries} entries allowed` }]
    };
  }
  
  // Validate headers
  const headers = Object.keys(csvData[0] || {});
  const headerErrors = validateCSVStructure(headers);
  if (headerErrors.length > 0) {
    return {
      isValid: false,
      errors: headerErrors
    };
  }
  
  // Validate each row
  csvData.forEach((row, index) => {
    // Type assertion for CSV row data
    const rowData = csvRowToBusinessCardData(row as Record<string, unknown>);
    const validation = validateBusinessCard(rowData);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        errors.push({
          field: `row_${index + 1}.${error.field}`,
          message: `Row ${index + 1}: ${error.message}`
        });
      });
    } else if (validation.data) {
      validData.push(validation.data);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    data: validData,
    rowCount: csvData.length
  };
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Check file size
  if (file.size > FILE_SETTINGS.maxFileSize) {
    errors.push({
      field: 'file',
      message: `File size must be less than ${FILE_SETTINGS.maxFileSize / 1024 / 1024}MB`
    });
  }
  
  // Check file type
  if (!FILE_SETTINGS.allowedTypes.includes(file.type)) {
    errors.push({
      field: 'file',
      message: 'Please upload a valid CSV file'
    });
  }
  
  return errors;
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const sanitizedName = sanitizeFilename(originalName);
  const extension = sanitizedName.split('.').pop();
  const nameWithoutExtension = sanitizedName.replace(`.${extension}`, '');
  
  return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
} 