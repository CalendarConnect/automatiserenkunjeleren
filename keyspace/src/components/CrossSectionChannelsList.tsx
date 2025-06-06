"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Hash, FileText, BookOpen, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

interface Channel {
  _id: string;
  naam: string;
  beschrijving: string;
  type: "discussie" | "templates" | "modules";
  slug: string;
  sectieId?: string;
  volgorde?: number;
  visible?: boolean;
}

interface Section {
  _id: string;
  naam: string;
  emoji: string;
  kleur: string;
  volgorde: number;
}

interface CrossSectionChannelsListProps {
  sections: Section[];
  channelsBySectionId: Record<string, Channel[]>;
  onChannelMove: (channelId: string, newSectionId: string | undefined, newOrder: Channel[]) => void;
  onEdit: (channelId: string) => void;
  onDelete: (channelId: string) => void;
  onToggleVisibility: (channelId: string) => void;
}

function SortableChannelItem({
  channel,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  channel: Channel;
  onEdit: (channelId: string) => void;
  onDelete: (channelId: string) => void;
  onToggleVisibility: (channelId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: channel._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "templates":
        return <FileText className="w-4 h-4" />;
      case "modules":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const isVisible = channel.visible ?? false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg ${
        isDragging ? "opacity-50 shadow-lg z-50" : ""
      } ${!isVisible ? "opacity-60 bg-gray-50" : ""}`}
    >
      <button
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-gray-500">
          {getChannelIcon(channel.type)}
        </span>
        <div className="flex-1">
          <h3 className={`font-medium ${!isVisible ? "text-gray-500" : "text-gray-900"}`}>
            {channel.naam}
          </h3>
          <p className="text-sm text-gray-500">{channel.beschrijving}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {channel.type}
            </span>
            <span className="text-xs text-gray-400">/{channel.slug}</span>
            {channel.volgorde && (
              <span className="text-xs text-gray-400">#{channel.volgorde}</span>
            )}
            {!isVisible && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                Verborgen
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleVisibility(channel._id)}
          className={isVisible ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
        >
          {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(channel._id)}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(channel._id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function DroppableSection({
  section,
  channels,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  section: Section;
  channels: Channel[];
  onEdit: (channelId: string) => void;
  onDelete: (channelId: string) => void;
  onToggleVisibility: (channelId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section._id}`,
  });

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{section.emoji}</span>
        <h2 className="text-lg font-semibold" style={{ color: section.kleur }}>
          {section.naam}
        </h2>
        <span className="text-sm text-muted-foreground">
          ({channels.length} kanalen)
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`space-y-2 min-h-[60px] transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-2' : ''
        }`}
      >
        {channels.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sleep kanalen hierheen</p>
          </div>
        ) : (
          channels.map((channel) => (
            <SortableChannelItem
              key={channel._id}
              channel={channel}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function CrossSectionChannelsList({
  sections,
  channelsBySectionId,
  onChannelMove,
  onEdit,
  onDelete,
  onToggleVisibility,
}: CrossSectionChannelsListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get all channel IDs for the sortable context
  const allChannelIds = Object.values(channelsBySectionId).flat().map(c => c._id);

  // Move the no-section droppable hook to top level
  const { setNodeRef: setNoSectionRef, isOver: isNoSectionOver } = useDroppable({
    id: 'section-no-section',
  });

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    // This handles the visual feedback during dragging
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeChannelId = active.id as string;
    const overId = over.id as string;

    // Find the active channel
    let activeChannel: Channel | undefined;
    let activeChannelSectionId: string | undefined;
    
    for (const [sectionId, channels] of Object.entries(channelsBySectionId)) {
      const found = channels.find(c => c._id === activeChannelId);
      if (found) {
        activeChannel = found;
        activeChannelSectionId = sectionId === 'no-section' ? undefined : sectionId;
        break;
      }
    }

    if (!activeChannel) return;

    // Determine the target section
    let targetSectionId: string | undefined;
    let targetChannels: Channel[] = [];

    // Check if we're dropping on a channel (to reorder within section)
    for (const [sectionId, channels] of Object.entries(channelsBySectionId)) {
      const targetChannel = channels.find(c => c._id === overId);
      if (targetChannel) {
        targetSectionId = sectionId === 'no-section' ? undefined : sectionId;
        targetChannels = channels;
        break;
      }
    }

    // If not dropping on a channel, check if dropping on a section
    if (!targetChannels.length) {
      // Check for section drop zones (section-{id} format)
      if (typeof overId === 'string' && overId.startsWith('section-')) {
        const sectionId = overId.replace('section-', '');
        if (sectionId === 'no-section') {
          targetSectionId = undefined;
          targetChannels = channelsBySectionId['no-section'] || [];
        } else {
          const targetSection = sections.find(s => s._id === sectionId);
          if (targetSection) {
            targetSectionId = targetSection._id;
            targetChannels = channelsBySectionId[targetSection._id] || [];
          }
        }
      }
    }

    // If we're moving to a different section
    if (activeChannelSectionId !== targetSectionId) {
      // Remove from current section and add to target section
      const newTargetChannels = [...targetChannels, activeChannel];
      onChannelMove(activeChannelId, targetSectionId, newTargetChannels);
    } else {
      // Reordering within the same section
      const activeIndex = targetChannels.findIndex(c => c._id === activeChannelId);
      const overIndex = targetChannels.findIndex(c => c._id === overId);
      
      if (activeIndex !== overIndex) {
        const newOrder = arrayMove(targetChannels, activeIndex, overIndex);
        onChannelMove(activeChannelId, targetSectionId, newOrder);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allChannelIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {/* Live sections */}
          {sections.map((section) => {
            const sectionChannels = channelsBySectionId[section._id] || [];
            return (
              <DroppableSection
                key={section._id}
                section={section}
                channels={sectionChannels}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleVisibility={onToggleVisibility}
              />
            );
          })}

          {/* Channels without section */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <h2 className="text-lg font-semibold text-gray-600">
                Kanalen zonder sectie
              </h2>
              <span className="text-sm text-muted-foreground">
                ({(channelsBySectionId['no-section'] || []).length} kanalen)
              </span>
            </div>
            
            <div 
              ref={setNoSectionRef}
              className={`space-y-2 min-h-[60px] transition-colors ${
                isNoSectionOver ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-2' : ''
              }`}
            >
              {(channelsBySectionId['no-section'] || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Sleep kanalen hierheen</p>
                </div>
              ) : (
                (channelsBySectionId['no-section'] || []).map((channel) => (
                  <SortableChannelItem
                    key={channel._id}
                    channel={channel}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleVisibility={onToggleVisibility}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
} 