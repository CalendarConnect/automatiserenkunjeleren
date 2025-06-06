"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import KanaalSidebar from "@/components/KanaalSidebar";
import { Hash, FileText, BookOpen, Users, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function KanalenPage() {
  const channels = useQuery(api.channels.getVisibleChannelsWithSecties);
  const [selectedType, setSelectedType] = useState<"alle" | "discussie" | "templates" | "modules">("alle");

  const getChannelIcon = (type: string, size: "sm" | "lg" = "sm") => {
    const className = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    switch (type) {
      case "discussie":
        return <Hash className={className} />;
      case "templates":
        return <FileText className={className} />;
      case "modules":
        return <BookOpen className={className} />;
      default:
        return <Hash className={className} />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      case 'blue':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'green':
        return 'bg-green-50 text-green-900 border-green-200';
      case 'purple':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'orange':
        return 'bg-orange-50 text-orange-900 border-orange-200';
      case 'pink':
        return 'bg-pink-50 text-pink-900 border-pink-200';
      default:
        return 'bg-gray-50 text-gray-900 border-gray-200';
    }
  };

  const filteredChannels = channels?.filter(channel => {
    if (selectedType === "alle") return true;
    return channel.type === selectedType;
  }) || [];

  // Group channels by their actual database sections
  const groupedChannels = filteredChannels.reduce((acc, channel) => {
    const sectionName = channel.sectie?.naam || 'Overig';
    const sectionEmoji = channel.sectie?.emoji || '📋';
    const sectionColor = channel.sectie?.kleur || '#6B7280';
    
    if (!acc[sectionName]) {
      acc[sectionName] = {
        name: sectionName,
        emoji: sectionEmoji,
        color: sectionColor,
        volgorde: channel.sectie?.volgorde || 999,
        channels: []
      };
    }
    acc[sectionName].channels.push(channel);
    return acc;
  }, {} as Record<string, any>);

  // Sort sections by their volgorde
  const sortedSections = Object.entries(groupedChannels).sort(([, a], [, b]) => {
    return (a.volgorde || 999) - (b.volgorde || 999);
  });

  if (!channels) {
    return (
      <div className="flex h-screen">
        <KanaalSidebar />
        <div className="flex-1 p-8">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200/50 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const typeFilters = [
    { value: 'alle', label: 'Alle kanalen', icon: Hash },
    { value: 'discussie', label: 'Discussies', icon: MessageSquare },
    { value: 'templates', label: 'Templates', icon: FileText },
    { value: 'modules', label: 'Modules', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-50/30">
      <KanaalSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="section-container">
          {/* Header */}
          <div className="header-section">
            <h1 className="text-3xl font-bold text-gray-900">
              Kanalen Overzicht
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Ontdek alle discussies, templates en modules in onze community
            </p>
          </div>

          {/* Type Filter */}
          <div className="mb-8">
            <div className="inline-flex p-1 bg-white rounded-lg shadow-sm border border-gray-200">
              {typeFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedType(filter.value as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                      selectedType === filter.value
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grouped Channels */}
          <div className="space-y-12">
            {sortedSections.map(([sectionName, sectionData]) => (
              <div key={sectionName}>
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{sectionData.emoji}</span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {sectionName}
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-full">
                    {sectionData.channels.length} kanalen
                  </span>
                </div>

                {/* Channel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionData.channels.map((channel: any) => (
                    <Link
                      key={channel._id}
                      href={`/kanaal/${channel.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-xl border border-gray-200 p-6 h-full hover:border-primary/30 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn(
                            "p-2 rounded-lg border",
                            getColorClasses('gray') // Use a neutral color since we don't have color mapping for hex colors
                          )}
                          style={{ 
                            backgroundColor: sectionData.color + '20', 
                            borderColor: sectionData.color + '40',
                            color: sectionData.color 
                          }}>
                            {getChannelIcon(channel.type, "lg")}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {channel.naam}
                        </h3>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {channel.beschrijving}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full border",
                            channel.type === 'discussie' && "bg-blue-50 text-blue-700 border-blue-200",
                            channel.type === 'templates' && "bg-purple-50 text-purple-700 border-purple-200",
                            channel.type === 'modules' && "bg-green-50 text-green-700 border-green-200"
                          )}>
                            {channel.type}
                          </span>
                          
                          {channel.stickyPosts?.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {channel.stickyPosts.length} vastgepind
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredChannels.length === 0 && (
            <div className="empty-state-modern">
              <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                <Hash className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Geen kanalen gevonden
              </h3>
              <p className="text-gray-600 mb-4">
                Er zijn geen kanalen van het type &quot;{selectedType}&quot;
              </p>
              <button
                onClick={() => setSelectedType("alle")}
                className="text-primary font-medium hover:underline"
              >
                Bekijk alle kanalen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 