"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, User, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CloudinaryAvatarUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  disabled?: boolean;
  userName?: string;
}

export default function CloudinaryAvatarUpload({ 
  onUpload, 
  onRemove, 
  currentImage, 
  disabled, 
  userName = "User" 
}: CloudinaryAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleUpload = () => {
    setIsUploading(true);
    
    // Cloudinary Upload Widget voor avatars
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djio4wfos',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'kanaal-headers',
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFiles: 1,
          cropping: true,
          croppingAspectRatio: 1, // Square aspect ratio for avatars
          croppingDefaultSelectionRatio: 1,
          croppingShowDimensions: true,
          folder: 'avatars',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: 5000000, // 5MB (smaller than headers)
          maxImageWidth: 800,
          maxImageHeight: 800,
          theme: 'minimal',
          showSkipCropButton: false, // Force cropping for consistent avatars
          croppingValidateDimensions: true,
        },
        (error: any, result: any) => {
          setIsUploading(false);
          
          if (error) {
            console.error('Upload error:', error);
            return;
          }
          
          if (result && result.event === 'success') {
            // Optimized URL for avatar format (square, multiple sizes)
            const optimizedUrl = `https://res.cloudinary.com/${
              process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djio4wfos'
            }/image/upload/c_fill,w_400,h_400,f_auto,q_auto,r_max/${result.info.public_id}`;
            
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

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={currentImage} />
            <AvatarFallback className="text-lg">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          
          {currentImage && onRemove && (
            <button
              onClick={handleRemove}
              disabled={disabled}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors disabled:opacity-50"
              title="Afbeelding verwijderen"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Profielafbeelding</h3>
          <p className="text-sm text-muted-foreground">
            {currentImage ? 'Klik op "Wijzigen" om een nieuwe afbeelding te uploaden' : 'Upload een profielafbeelding'}
          </p>
        </div>
      </div>
      
      {/* Upload Button */}
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
            {currentImage ? 'Afbeelding wijzigen' : 'Afbeelding uploaden'}
          </>
        )}
      </Button>
      
      {/* Upload Info */}
      <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-md">
        <p className="font-medium">Upload vereisten:</p>
        <p>• Vierkant formaat (wordt automatisch bijgesneden)</p>
        <p>• Maximaal: 5MB, JPG/PNG/WebP</p>
        <p>• Aanbevolen: minimaal 400x400px</p>
        <p>• Automatische optimalisatie en ronde hoeken</p>
      </div>
    </div>
  );
} 