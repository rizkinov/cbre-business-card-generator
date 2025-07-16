"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CBREButton } from "@/src/components/cbre/CBREButton";
import { CBREStyledCard } from "@/src/components/cbre/CBREStyledCard";
import { toast } from "@/src/components/cbre/CBREToast";
import { FormFields } from "./FormFields";
import { businessCardFormSchema } from "@/utils/validation";
import { BusinessCardFormData } from "@/types/business-card";
import { API_ENDPOINTS } from "@/utils/constants";
import { FileText, Download, Loader2, CheckCircle } from "lucide-react";

interface CardEditorProps {
  onError?: (error: string) => void;
}

export function CardEditor({ onError }: CardEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const form = useForm<BusinessCardFormData>({
    resolver: zodResolver(businessCardFormSchema),
    defaultValues: {
      fullName: '',
      title: '',
      licenseNumber: '',
      officeName: '',
      officeAddress: '',
      email: '',
      telephone: '',
      mobile: '',
      includeBleed: false
    },
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isValid, errors } } = form;

  const onSubmit = async (data: BusinessCardFormData) => {
    setIsSubmitting(true);
    setLastGenerated(null);

    try {
      // Convert form data to API format
      const apiData = {
        ...data,
        includeBleed: data.includeBleed
      };

      // Call PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get the file info from response
      const result = await response.json();
      
      if (result.success && result.downloadUrl) {
        // Open download URL in new tab
        window.open(result.downloadUrl, '_blank');
        
        setLastGenerated(result.downloadUrl); // Store download URL
        
        // Show success toast with expiration info
        const expiresAt = new Date(result.expiresAt);
        const expiresInHours = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60));
        
        toast({
          title: "Business Card Generated!",
          description: `Your PDF is ready for download. Link expires in ${expiresInHours} hours.`,
          variant: "success"
        });
      } else {
        throw new Error(result.message || 'PDF generation failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError?.(message);
      
      // Show error toast
      toast({
        title: "Generation Failed",
        description: message,
        variant: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (lastGenerated) {
      // If we have a download URL, open it directly
      window.open(lastGenerated, '_blank');
    } else {
      // Re-submit form to generate and download PDF again
      handleSubmit(onSubmit)();
    }
  };

  const handleReset = () => {
    form.reset();
    setLastGenerated(null);
  };

  return (
    <div className="space-y-6">
      <CBREStyledCard
        title="Single Business Card"
        description="Fill out the form below to generate your business card"
        className="w-full"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormFields form={form} isSubmitting={isSubmitting} />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <CBREButton
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Business Card
                </>
              )}
            </CBREButton>

            {lastGenerated && (
              <CBREButton
                type="button"
                variant="outline"
                onClick={handleDownload}
                className="flex-1 sm:flex-none"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </CBREButton>
            )}

            <CBREButton
              type="button"
              variant="text"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Reset Form
            </CBREButton>
          </div>

          {/* Success Message */}
          {lastGenerated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Business card generated successfully!
                </span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your PDF is ready for download. Files expire after 24 hours.
              </p>
            </div>
          )}

          {/* Form Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <FileText className="w-5 h-5" />
                <span className="font-medium">
                  Please fix the following errors:
                </span>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="flex items-start gap-1">
                    <span className="text-red-500">•</span>
                    <span>
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
                      {' '}{error?.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </CBREStyledCard>

      {/* Tips Section */}
      <CBREStyledCard
        title="Tips for Better Results"
        description="Follow these guidelines for professional business cards"
        className="w-full"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-cbre-green">Design Selection</h4>
              <p className="text-sm text-gray-600">
                Choose Design 1 for a classic layout with prominent contact information,
                or Design 2 for a more modern approach with emphasized titles.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cbre-green">Bleed Settings</h4>
              <p className="text-sm text-gray-600">
                Enable 3mm bleed if you're printing professionally. This ensures
                no white edges appear when the card is cut to size.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cbre-green">Text Length</h4>
              <p className="text-sm text-gray-600">
                Keep titles concise and addresses clear. Long text may be automatically
                adjusted to fit within the card design.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cbre-green">Contact Information</h4>
              <p className="text-sm text-gray-600">
                Include country codes for international contacts and ensure
                all phone numbers are accurate and properly formatted.
              </p>
            </div>
          </div>
        </div>
      </CBREStyledCard>
    </div>
  );
} 