"use client";

import { Download, FileText, Youtube, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

interface ThreadAttachmentsProps {
  attachments: AttachmentsData;
}

export default function ThreadAttachments({ attachments }: ThreadAttachmentsProps) {
  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
      case 'xlsx':
      case 'xls':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const hasContent = (attachments.videos?.length || 0) > 0 || (attachments.downloads?.length || 0) > 0;
  
  if (!hasContent) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Video Embeddings */}
      {attachments.videos && attachments.videos.length > 0 && (
        <div className="space-y-4">
          {attachments.videos.map((video, index) => (
            <div key={index} className="w-full">
              {video.type === "youtube" ? (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(video.url)}?rel=0`}
                    title={video.title || "YouTube Video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full">
                  <video 
                    className="w-full h-auto rounded-lg max-h-96" 
                    controls
                    preload="metadata"
                  >
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Download Files */}
      {attachments.downloads && attachments.downloads.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Download className="w-4 h-4" />
                Downloadbare Bestanden
              </h4>
              <div className="grid gap-2">
                {attachments.downloads.map((download, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    asChild
                  >
                    <a
                      href={download.url}
                      download={download.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full"
                    >
                      <div className="flex-shrink-0">
                        {getFileTypeIcon(download.fileType)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{download.filename}</div>
                        <div className="text-xs text-muted-foreground">
                          {download.fileType.toUpperCase()}
                          {download.fileSize && ` • ${formatFileSize(download.fileSize)}`}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 