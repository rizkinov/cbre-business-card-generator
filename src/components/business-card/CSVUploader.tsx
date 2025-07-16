"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { CBREButton } from "@/src/components/cbre/CBREButton";
import { CBREStyledCard } from "@/src/components/cbre/CBREStyledCard";
import { Checkbox } from "@/src/components/ui/checkbox";
import { toast } from "@/src/components/cbre/CBREToast";
import { validateCSVData, validateFileUpload } from "@/utils/validation";
import { BusinessCardData, CSVValidationResult } from "@/types/business-card";
import { FILE_SETTINGS } from "@/utils/constants";
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Loader2,
  Users,
  FileSpreadsheet 
} from "lucide-react";

interface CSVUploaderProps {
  onSuccess?: (data: BusinessCardData[]) => void;
  onError?: (error: string) => void;
}

export function CSVUploader({ onSuccess, onError }: CSVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeBleed, setIncludeBleed] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: unknown[]) => {
    if (rejectedFiles.length > 0) {
      toast({
        title: "File Rejected",
        description: "Please upload a valid CSV file.",
        variant: "error"
      });
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    // Validate file
    const fileErrors = validateFileUpload(selectedFile);
    if (fileErrors.length > 0) {
      toast({
        title: "File Validation Error",
        description: fileErrors[0].message,
        variant: "error"
      });
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  }, []);

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validation = validateCSVData(results.data);
        setValidationResult(validation);
        
        if (validation.isValid) {
          toast({
            title: "CSV Parsed Successfully",
            description: `Found ${validation.rowCount} valid entries.`,
            variant: "success"
          });
        } else {
          toast({
            title: "CSV Validation Failed",
            description: `Found ${validation.errors.length} errors.`,
            variant: "error"
          });
        }
      },
      error: (error) => {
        toast({
          title: "CSV Parse Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "error"
        });
        // Log error for debugging - this is legitimate production error logging
        console.error('CSV Parse Error:', error);
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    maxFiles: 1,
    maxSize: FILE_SETTINGS.maxFileSize
  });

  const handleGenerateBatch = async () => {
    if (!validationResult?.isValid || !validationResult.data) {
      toast({
        title: "Invalid Data",
        description: "Please fix validation errors before generating.",
        variant: "error"
      });
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);
    setProgress(0);
    setCurrentStep('Preparing batch generation...');

    try {
      setProgress(20);
      setCurrentStep('Sending data to server...');
      const response = await fetch('/api/generate-batch-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csvData: validationResult.data,
          includeBleed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate batch PDFs');
      }

      setProgress(60);
      setCurrentStep('Generating PDFs...');

      // Get the result from response
      const result = await response.json();
      
      if (result.success && result.downloadUrl) {
        setProgress(80);
        setCurrentStep('Creating ZIP file...');
        
        // Open download URL in new tab
        window.open(result.downloadUrl, '_blank');
        
        setProgress(100);
        setCurrentStep('Download complete!');
        
        onSuccess?.(validationResult.data);
        
        // Show success toast with metadata
        const metadata = result.metadata;
        const successCount = metadata?.successfulGenerations || validationResult.data.length;
        const failedCount = metadata?.failedGenerations || 0;
        const expiresAt = new Date(result.expiresAt);
        const expiresInHours = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60));
        
        toast({
          title: "Batch Generated!",
          description: `Successfully generated ${successCount} PDFs${failedCount > 0 ? ` (${failedCount} failed)` : ''}. ZIP file ready for download. Link expires in ${expiresInHours} hours.`,
          variant: "success"
        });
      } else {
        throw new Error(result.message || 'Batch generation failed');
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError?.(message);
      
      toast({
        title: "Generation Failed",
        description: message,
        variant: "error"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template/business-card-template.csv';
    link.download = 'business-card-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleReset = () => {
    setFile(null);
    setValidationResult(null);
    setDownloadUrl(null);
    setIncludeBleed(false);
  };

  return (
    <div className="space-y-6">
      {/* Template Download Section */}
      <CBREStyledCard
        title="Download CSV Template"
        description="Use this template to format your business card data"
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-cbre-green" />
            <div>
              <h4 className="font-medium">Business Card Template</h4>
              <p className="text-sm text-gray-600">
                CSV template with example data and required columns
              </p>
            </div>
          </div>
          <CBREButton
            variant="outline"
            onClick={handleDownloadTemplate}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </CBREButton>
        </div>
      </CBREStyledCard>

      {/* File Upload Section */}
      <CBREStyledCard
        title="Upload CSV File"
        description="Upload your CSV file with business card data"
        className="w-full"
      >
        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-cbre-green bg-cbre-green/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop CSV file here' : 'Drag & drop CSV file here'}
                </p>
                <p className="text-sm text-gray-600">
                  or click to select file (max {FILE_SETTINGS.maxFileSize / 1024 / 1024}MB)
                </p>
              </div>
              <CBREButton variant="outline" type="button">
                Select File
              </CBREButton>
            </div>
          </div>

          {/* File Info */}
          {file && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cbre-green" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <CBREButton
                  variant="text"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </CBREButton>
              </div>
            </div>
          )}

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-4">
              {validationResult.isValid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">
                      CSV Validation Successful
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-green-700 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{validationResult.rowCount} entries</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>Ready for generation</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">
                      CSV Validation Failed
                    </span>
                  </div>
                  <div className="space-y-2">
                    {validationResult.errors.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-red-700 text-sm flex items-start gap-1">
                        <span className="text-red-500">•</span>
                        <span>{error.message}</span>
                      </p>
                    ))}
                    {validationResult.errors.length > 5 && (
                      <p className="text-red-700 text-sm">
                        ...and {validationResult.errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          {validationResult?.isValid && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="batchBleed"
                  checked={includeBleed}
                  onCheckedChange={(checked: boolean) => setIncludeBleed(checked)}
                />
                <label htmlFor="batchBleed" className="text-sm font-medium">
                  Include 3mm bleed for all cards
                </label>
              </div>
              <p className="text-xs text-gray-600">
                Bleed adds 3mm border around each card for professional printing
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Processing Batch</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-blue-700">
                  <span>{currentStep}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <CBREButton
              onClick={handleGenerateBatch}
              disabled={!validationResult?.isValid || isProcessing}
              className="flex-1 sm:flex-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Batch...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Batch ({validationResult?.rowCount || 0})
                </>
              )}
            </CBREButton>

            {downloadUrl && (
              <CBREButton
                variant="outline"
                onClick={handleDownload}
                className="flex-1 sm:flex-none"
              >
                <Download className="w-4 h-4 mr-2" />
                Download ZIP
              </CBREButton>
            )}

            <CBREButton
              variant="text"
              onClick={handleReset}
              disabled={isProcessing}
              className="flex-1 sm:flex-none"
            >
              Reset
            </CBREButton>
          </div>

          {/* Success Message */}
          {downloadUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">
                  Batch generation completed!
                </span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your ZIP file containing all business cards is ready for download.
              </p>
            </div>
          )}
        </div>
      </CBREStyledCard>
    </div>
  );
} 