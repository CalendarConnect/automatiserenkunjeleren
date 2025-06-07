"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";

interface CloudinaryUploadThreadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  disabled?: boolean;
}

export default function CloudinaryUploadThread({ onUpload, onRemove, currentImage, disabled }: CloudinaryUploadThreadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    
    // Cloudinary Upload Widget voor threads (compactere instellingen)
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djio4wfos',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'kanaal-headers',
          sources: ['local', 'url'],
          multiple: false,
          maxFiles: 1,
          cropping: false, // Geen cropping voor threads
          folder: 'thread-images',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: 3000000, // 3MB (kleiner dan headers)
          maxImageWidth: 800,   // Veel kleiner dan headers
          maxImageHeight: 600,
          theme: 'minimal',
          resourceType: 'image',
        },
        (error: any, result: any) => {
          setIsUploading(false);
          
          if (error) {
            console.error('Upload error:', error);
            return;
          }
          
          if (result && result.event === 'success') {
            // Optimized URL voor thread afbeeldingen (kleiner)
            const optimizedUrl = `https://res.cloudinary.com/${
              process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djio4wfos'
            }/image/upload/c_limit,w_800,h_600,f_auto,q_auto/${result.info.public_id}`;
            
            onUpload(optimizedUrl);
          }
        }
      );
      
      widget.open();
    } else {
      // Fallback: Load Cloudinary script if not loaded
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.onload = () => {
        handleUpload(); // Retry after script loads
      };
      document.head.appendChild(script);
    }
  };

  return (
    <div className="space-y-3">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Thread afbeelding"
            className="w-full max-w-md h-auto rounded-lg border shadow-sm"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              title="Afbeelding verwijderen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 mb-3">
            Voeg een afbeelding toe aan je thread
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUpload}
            disabled={disabled || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploaden...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Afbeelding uploaden
              </>
            )}
          </Button>
        </div>
      )}
      
      {!currentImage && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Max 3MB, 800x600px optimaal</p>
          <p>• JPG, PNG, WebP ondersteund</p>
          <p>• Automatische compressie voor snelle loading</p>
        </div>
      )}
    </div>
  );
} 