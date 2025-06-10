"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Video, 
  FileText, 
  Download, 
  X, 
  Youtube, 
  Play, 
  Loader2,
  Plus,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoAttachment {
  type: "youtube" | "mp4";
  url: string;
  title?: string;
  thumbnail?: string;
}

interface DownloadAttachment {
  filename: string;
  url: string;
  fileType: string;
  fileSize?: number;
  uploadedAt: number;
}

interface AttachmentsData {
  videos?: VideoAttachment[];
  downloads?: DownloadAttachment[];
}

interface AdminFileAttachmentsProps {
  onAttachmentsChange: (attachments: AttachmentsData | undefined) => void;
  disabled?: boolean;
}

export default function AdminFileAttachments({ 
  onAttachmentsChange, 
  disabled = false 
}: AdminFileAttachmentsProps) {
  const [attachments, setAttachments] = useState<AttachmentsData>({});
  const [newYouTubeUrl, setNewYouTubeUrl] = useState("");
  const [newMp4Url, setNewMp4Url] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const updateAttachments = (newAttachments: AttachmentsData) => {
    setAttachments(newAttachments);
    // Only send attachments if they contain any data
    const hasContent = (newAttachments.videos?.length || 0) > 0 || (newAttachments.downloads?.length || 0) > 0;
    onAttachmentsChange(hasContent ? newAttachments : undefined);
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const addYouTubeVideo = () => {
    if (!newYouTubeUrl.trim()) return;
    
    const videoId = extractYouTubeId(newYouTubeUrl);
    if (!videoId) {
      alert("Ongeldige YouTube URL");
      return;
    }

    const newVideo: VideoAttachment = {
      type: "youtube",
      url: newYouTubeUrl.trim(),
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };

    const updatedAttachments = {
      ...attachments,
      videos: [...(attachments.videos || []), newVideo],
    };

    updateAttachments(updatedAttachments);
    setNewYouTubeUrl("");
  };

  const addMp4Video = () => {
    if (!newMp4Url.trim()) return;

    const newVideo: VideoAttachment = {
      type: "mp4",
      url: newMp4Url.trim(),
    };

    const updatedAttachments = {
      ...attachments,
      videos: [...(attachments.videos || []), newVideo],
    };

    updateAttachments(updatedAttachments);
    setNewMp4Url("");
  };

  const removeVideo = (index: number) => {
    const updatedVideos = attachments.videos?.filter((_, i) => i !== index) || [];
    const updatedAttachments = {
      ...attachments,
      videos: updatedVideos.length > 0 ? updatedVideos : undefined,
    };
    updateAttachments(updatedAttachments);
  };

  const removeDownload = (index: number) => {
    const updatedDownloads = attachments.downloads?.filter((_, i) => i !== index) || [];
    const updatedAttachments = {
      ...attachments,
      downloads: updatedDownloads.length > 0 ? updatedDownloads : undefined,
    };
    updateAttachments(updatedAttachments);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djio4wfos',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'kanaal-headers',
          sources: ['local'],
          multiple: true,
          maxFiles: 10,
          folder: 'thread-attachments',
          resourceType: 'auto', // Allow all file types
          clientAllowedFormats: ['json', 'docx', 'pdf', 'txt', 'xlsx', 'pptx', 'zip', 'rar'],
          maxFileSize: 10000000, // 10MB
          theme: 'minimal',
        },
        (error: any, result: any) => {
          setIsUploading(false);
          
          if (error) {
            console.error('Upload error:', error);
            return;
          }
          
          if (result && result.event === 'success') {
            const fileInfo = result.info;
            const newDownload: DownloadAttachment = {
              filename: fileInfo.original_filename + '.' + fileInfo.format,
              url: fileInfo.secure_url,
              fileType: fileInfo.format,
              fileSize: fileInfo.bytes,
              uploadedAt: Date.now(),
            };

            const updatedAttachments = {
              ...attachments,
              downloads: [...(attachments.downloads || []), newDownload],
            };

            updateAttachments(updatedAttachments);
          }
        }
      );
      
      widget.open();
    } else {
      // Fallback: Load Cloudinary script if not loaded
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.onload = () => {
        handleFileUpload(); // Retry after script loads
      };
      document.head.appendChild(script);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'json':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bijlagen (Alleen voor Admins)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video's
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Downloads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
            {/* YouTube Video Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                YouTube Video URL
              </Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newYouTubeUrl}
                  onChange={(e) => setNewYouTubeUrl(e.target.value)}
                  disabled={disabled}
                />
                <Button
                  type="button"
                  onClick={addYouTubeVideo}
                  disabled={disabled || !newYouTubeUrl.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* MP4 Video Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-500" />
                MP4 Video URL
              </Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={newMp4Url}
                  onChange={(e) => setNewMp4Url(e.target.value)}
                  disabled={disabled}
                />
                <Button
                  type="button"
                  onClick={addMp4Video}
                  disabled={disabled || !newMp4Url.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Video List */}
            {attachments.videos && attachments.videos.length > 0 && (
              <div className="space-y-2">
                <Label>Toegevoegde Video's:</Label>
                {attachments.videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {video.type === "youtube" ? (
                        <Youtube className="w-4 h-4 text-red-500" />
                      ) : (
                        <Play className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="text-sm truncate max-w-xs">{video.url}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVideo(index)}
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="downloads" className="space-y-4">
            {/* File Upload Section */}
            <div className="space-y-3">
              <Label>Bestanden Uploaden</Label>
              <Button
                type="button"
                onClick={handleFileUpload}
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
                    Bestanden Selecteren
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Ondersteunde formaten: JSON, DOCX, PDF, TXT, XLSX, PPTX, ZIP, RAR (max 10MB per bestand)
              </p>
            </div>

            {/* Downloads List */}
            {attachments.downloads && attachments.downloads.length > 0 && (
              <div className="space-y-2">
                <Label>Geüploade Bestanden:</Label>
                {attachments.downloads.map((download, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getFileTypeIcon(download.fileType)}
                      <div>
                        <div className="text-sm font-medium">{download.filename}</div>
                        <div className="text-xs text-muted-foreground">
                          {download.fileType.toUpperCase()} • {formatFileSize(download.fileSize)}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDownload(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 