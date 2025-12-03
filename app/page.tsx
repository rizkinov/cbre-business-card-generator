"use client";

import { CBRETabs } from "@/src/components/cbre/CBRETabs";
import { TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { CardEditor } from "@/src/components/business-card/CardEditor";
import { CSVUploader } from "@/src/components/business-card/CSVUploader";
import { PasswordGate } from "@/src/components/auth/PasswordGate";
import { FileText, Upload } from "lucide-react";

export default function Home() {
  const handleBatchSuccess = (data: unknown) => {
    // Success handled by component toast notifications
  };

  const handleError = (error: string) => {
    // Error handled by component toast notifications
  };

  return (
    <PasswordGate>
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col justify-center h-20">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium mb-0.5">THE CREATIVE COE</p>
            <h1 className="text-2xl font-financier text-cbre-dark-green tracking-tight">
              Business Card Generator
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
        {/* Main Editor Interface */}
        <div className="w-full">
          <CBRETabs defaultValue="single" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-8 !bg-transparent p-0 h-auto border-b border-gray-200 !rounded-none">
              <TabsTrigger
                value="single"
                className="flex items-center justify-center gap-2 py-3 !rounded-none text-sm font-medium text-gray-400 !shadow-none !bg-transparent border-b-[3px] border-transparent -mb-px data-[state=active]:text-[#003F2D] data-[state=active]:border-[#003F2D]"
              >
                <FileText className="w-4 h-4" />
                Single Card
              </TabsTrigger>
              <TabsTrigger
                value="batch"
                className="flex items-center justify-center gap-2 py-3 !rounded-none text-sm font-medium text-gray-400 !shadow-none !bg-transparent border-b-[3px] border-transparent -mb-px data-[state=active]:text-[#003F2D] data-[state=active]:border-[#003F2D]"
              >
                <Upload className="w-4 h-4" />
                Batch CSV
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="mt-0">
              <CardEditor
                onError={handleError}
              />
            </TabsContent>

            <TabsContent value="batch" className="mt-0">
              <CSVUploader
                onSuccess={handleBatchSuccess}
                onError={handleError}
              />
            </TabsContent>
          </CBRETabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} CBRE Business Card Editor • Files expire after 24 hours</p>
          </div>
        </div>
      </footer>
    </div>
    </PasswordGate>
  );
}
