"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CBREButton } from "@/src/components/cbre/CBREButton";
import { toast } from "@/src/components/cbre/CBREToast";
import { FormFields } from "./FormFields";
import { businessCardFormSchema } from "@/utils/validation";
import { BusinessCardFormData } from "@/types/business-card";
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
      includeBleed: true
    },
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isValid, errors }, watch } = form;

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormFields form={form} isSubmitting={isSubmitting} />

        {/* Form Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <CBREButton
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
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
          >
            Reset Form
          </CBREButton>
        </div>

        {/* Success Message */}
        {lastGenerated && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                Business card generated successfully!
              </span>
            </div>
            <p className="text-emerald-700 text-sm mt-1 ml-7">
              Your PDF is ready for download. Files expire after 24 hours.
            </p>
          </div>
        )}
      </form>

      {/* Tips Section */}
      <section className="pt-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Tips for Better Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-500">
          <p><span className="text-gray-700 font-medium">Bleed Settings:</span> Enable 3mm bleed for professional printing to avoid white edges.</p>
          <p><span className="text-gray-700 font-medium">Text Length:</span> Keep titles concise. Long text may be auto-adjusted.</p>
          <p><span className="text-gray-700 font-medium">Contact Info:</span> Include country codes for international numbers.</p>
          <p><span className="text-gray-700 font-medium">Address:</span> Use clear, properly formatted addresses.</p>
        </div>
      </section>
    </div>
  );
}