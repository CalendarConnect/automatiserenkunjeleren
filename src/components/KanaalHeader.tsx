"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CloudinaryUpload, { loadCloudinaryScript } from "./CloudinaryUpload";
import { Edit, Save, X, Image, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViewAwareAdmin } from "@/lib/useViewAwareRole";

interface KanaalHeaderProps {
  channel: {
    _id: string;
    naam: string;
    beschrijving: string;
    headerAfbeelding?: string;
  };
}

export default function KanaalHeader({ channel }: KanaalHeaderProps) {
  const { isAdmin } = useViewAwareAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [headerAfbeelding, setHeaderAfbeelding] = useState(channel.headerAfbeelding || "");

  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');
  
  // Inline editing states voor titel en beschrijving
  const [isEditingTitel, setIsEditingTitel] = useState(false);
  const [isEditingBeschrijving, setIsEditingBeschrijving] = useState(false);
  const [titel, setTitel] = useState(channel.naam);
  const [beschrijving, setBeschrijving] = useState(channel.beschrijving);
  
  const updateChannelHeader = useMutation(api.channels.updateChannelHeader);
  const updateChannel = useMutation(api.channels.updateChannel);

  useEffect(() => {
    // Load Cloudinary script on component mount
    loadCloudinaryScript();
  }, []);

  // Sync local state with props when channel data changes
  useEffect(() => {
    setTitel(channel.naam);
    setBeschrijving(channel.beschrijving);
    setHeaderAfbeelding(channel.headerAfbeelding || "");
  }, [channel.naam, channel.beschrijving, channel.headerAfbeelding]);
  
  const handleSave = async () => {
    try {
      const cleanAfbeelding = headerAfbeelding.trim();
      
      await updateChannelHeader({
        kanaalId: channel._id as any,
        headerAfbeelding: cleanAfbeelding || undefined,
        headerOmschrijving: undefined,
      });
      setIsEditing(false);
      
      // Force page reload to show updated content
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Fout bij opslaan header:", error);
    }
  };

  const handleCancel = () => {
    setHeaderAfbeelding(channel.headerAfbeelding || "");
    setIsEditing(false);
  };

  const handleSaveTitel = async () => {
    const newTitel = titel.trim();
    if (!newTitel) {
      alert("Titel mag niet leeg zijn");
      setTitel(channel.naam);
      setIsEditingTitel(false);
      return;
    }
    
    try {
      await updateChannel({
        kanaalId: channel._id as any,
        naam: newTitel,
      });
      setIsEditingTitel(false);
    } catch (error) {
      console.error("Fout bij opslaan titel:", error);
      setTitel(channel.naam); // Reset bij fout
      setIsEditingTitel(false);
    }
  };

  const handleSaveBeschrijving = async () => {
    const newBeschrijving = beschrijving.trim();
    if (!newBeschrijving) {
      alert("Beschrijving mag niet leeg zijn");
      setBeschrijving(channel.beschrijving);
      setIsEditingBeschrijving(false);
      return;
    }
    
    try {
      await updateChannel({
        kanaalId: channel._id as any,
        beschrijving: newBeschrijving,
      });
      setIsEditingBeschrijving(false);
    } catch (error) {
      console.error("Fout bij opslaan beschrijving:", error);
      setBeschrijving(channel.beschrijving); // Reset bij fout
      setIsEditingBeschrijving(false);
    }
  };

  const handleCancelTitel = () => {
    setTitel(channel.naam);
    setIsEditingTitel(false);
  };

  const handleCancelBeschrijving = () => {
    setBeschrijving(channel.beschrijving);
    setIsEditingBeschrijving(false);
  };

  return (
    <div className="mb-6">
      {/* Header Afbeelding */}
      {(channel.headerAfbeelding || isEditing) && (
        <div className="mb-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Header Afbeelding
                </label>
                
                {/* Upload Method Toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    type="button"
                    variant={uploadMethod === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUploadMethod('upload')}
                  >
                    📤 Uploaden
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUploadMethod('url')}
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    URL
                  </Button>
                </div>

                {uploadMethod === 'upload' ? (
                  <CloudinaryUpload
                    onUpload={(url) => setHeaderAfbeelding(url)}
                    currentImage={headerAfbeelding}
                  />
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={headerAfbeelding}
                      onChange={(e) => setHeaderAfbeelding(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full"
                    />
                    {headerAfbeelding && (
                      <div className="mt-2">
                        <img
                          src={headerAfbeelding}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : channel.headerAfbeelding ? (
            <img
              src={channel.headerAfbeelding}
              alt={`${channel.naam} header`}
              className="w-full h-48 object-cover rounded-lg border shadow-sm"
            />
          ) : null}
        </div>
      )}



      {/* Kanaal Titel en Beschrijving */}
      <div className="mb-4">
        {/* Titel */}
        <div className="flex items-start gap-2 mb-2">
          {isEditingTitel ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                className="text-2xl font-bold border-2 border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitel();
                  if (e.key === 'Escape') handleCancelTitel();
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleSaveTitel}>
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelTitel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2 group">
              <h1 className="text-2xl font-bold text-foreground">
                {titel}
              </h1>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingTitel(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                  title="Titel bewerken"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Beschrijving */}
        <div className="flex items-start gap-2">
          {isEditingBeschrijving ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={beschrijving}
                onChange={(e) => setBeschrijving(e.target.value)}
                className="border-2 border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBeschrijving();
                  if (e.key === 'Escape') handleCancelBeschrijving();
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleSaveBeschrijving}>
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelBeschrijving}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2 group">
              <p className="text-muted-foreground">
                {beschrijving}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingBeschrijving(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                  title="Beschrijving bewerken"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Header edit controls */}
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Annuleren
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Opslaan
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Header afbeelding bewerken
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Placeholder voor admin wanneer er geen header is */}
      {isAdmin && !channel.headerAfbeelding && !isEditing && (
        <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 mb-2">
            Voeg een header afbeelding toe aan dit kanaal
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Edit className="w-4 h-4" />
            Header afbeelding toevoegen
          </Button>
        </div>
      )}
    </div>
  );
} 