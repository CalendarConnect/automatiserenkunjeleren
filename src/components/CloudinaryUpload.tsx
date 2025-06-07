"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  disabled?: boolean;
}

export default function CloudinaryUpload({ onUpload, currentImage, disabled }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    
    // Cloudinary Upload Widget
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djio4wfos',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'kanaal-headers',
          sources: ['local', 'url'],
          multiple: false,
          maxFiles: 1,
          cropping: true,
          croppingAspectRatio: 4, // LinkedIn banner ratio (4:1)
          croppingDefaultSelectionRatio: 1,
          croppingShowDimensions: true,
          folder: 'kanaal-headers',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: 10000000, // 10MB
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          theme: 'minimal',
        },
        (error: any, result: any) => {
          setIsUploading(false);
          
          if (error) {
            console.error('Upload error:', error);
            return;
          }
          
          if (result && result.event === 'success') {
            // Optimized URL for LinkedIn banner format
            const optimizedUrl = `https://res.cloudinary.com/${
              process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djio4wfos'
            }/image/upload/c_fill,w_1584,h_396,f_auto,q_auto/${result.info.public_id}`;
            
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
    <div className="space-y-4">
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Current header"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            1584x396px (LinkedIn banner)
          </div>
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        onClick={handleUpload}
        disabled={disabled || isUploading}
        className="w-full flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploaden...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            {currentImage ? 'Andere afbeelding uploaden' : 'Afbeelding uploaden'}
          </>
        )}
      </Button>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Aanbevolen: 1584x396px (LinkedIn banner formaat)</p>
        <p>• Maximaal: 10MB, JPG/PNG/WebP</p>
        <p>• Automatische optimalisatie en cropping</p>
      </div>
    </div>
  );
}

// Script loader for Cloudinary widget
export function loadCloudinaryScript() {
  if (typeof window !== 'undefined' && !(window as any).cloudinary) {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.head.appendChild(script);
  }
} 