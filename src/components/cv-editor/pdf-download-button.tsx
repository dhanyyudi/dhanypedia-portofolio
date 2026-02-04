'use client';

import { useState } from 'react';
import { Download, Loader2, FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface PDFDownloadButtonProps {
  resumeId: string;
  resumeTitle: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function PDFDownloadButton({ resumeId, resumeTitle, className = '', variant = 'default' }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch(`/api/cv/${resumeId}/pdf`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate PDF');
      }

      // Get the blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeTitle.replace(/[^a-zA-Z0-9]/g, '_')}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 disabled:opacity-50 transition-all ${className}`}
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        {isGenerating ? 'Generating...' : 'PDF'}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-primary)] to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download PDF
        </>
      )}
    </button>
  );
}
