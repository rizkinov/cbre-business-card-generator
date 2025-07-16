"use client";

import { useState } from 'react';
import { CBREStyledCard } from "@/src/components/cbre/CBREStyledCard";
import { CBRETabs } from "@/src/components/cbre/CBRETabs";
import { TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { CardEditor } from "@/src/components/business-card/CardEditor";
import { CSVUploader } from "@/src/components/business-card/CSVUploader";
import { FileText, Upload } from "lucide-react";

export default function Home() {
  const handleBatchSuccess = (data: unknown) => {
    console.log('Batch generated:', data);
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-cbre-green rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-financier font-semibold text-cbre-green">
                  CBRE Business Card Editor
                </h1>
                <p className="text-sm text-gray-600">Generate print-ready CMYK PDFs</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent-green/10 text-accent-green border-accent-green">
              v1.0.0
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-financier font-semibold text-cbre-green mb-4">
            Professional Business Cards Made Easy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create print-ready CBRE business cards with our professional editor. 
            Generate single cards or batch process up to 20 cards with CSV upload.
          </p>
        </div>

        {/* Main Editor Interface */}
        <CBREStyledCard 
          title="Choose Your Method"
          description="Create a single card or batch process multiple cards"
          className="max-w-6xl mx-auto"
        >
          <CBRETabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Single Card
              </TabsTrigger>
              <TabsTrigger value="batch" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Batch CSV
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <CardEditor 
                onError={handleError}
              />
            </TabsContent>

            <TabsContent value="batch">
              <CSVUploader 
                onSuccess={handleBatchSuccess}
                onError={handleError}
              />
            </TabsContent>
          </CBRETabs>
        </CBREStyledCard>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 CBRE Business Card Editor</p>
            <p className="text-sm">
              Built with CBRE Web Elements • Files expire after 24 hours
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
