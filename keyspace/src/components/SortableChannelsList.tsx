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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  SortableContext as SortableContextProvider,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Hash, FileText, BookOpen, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "./ui/button";

interface Channel {
  _id: string;
  naam: string;
  beschrijving: string;
  type: "discussie" | "templates" | "modules";
  slug: string;
  volgorde?: number;
}

interface SortableChannelsListProps {
  channels: Channel[];
  onReorder: (newOrder: Channel[]) => void;
  onEdit: (channelId: string) => void;
  onDelete: (channelId: string) => void;
}

function SortableChannelItem({
  channel,
  onEdit,
  onDelete,
}: {
  channel: Channel;
  onEdit: (channelId: string) => void;
  onDelete: (channelId: string) => void;
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
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
          <h3 className="font-medium text-gray-900">{channel.naam}</h3>
          <p className="text-sm text-gray-500">{channel.beschrijving}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {channel.type}
            </span>
            <span className="text-xs text-gray-400">/{channel.slug}</span>
            {channel.volgorde && (
              <span className="text-xs text-gray-400">#{channel.volgorde}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
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

export default function SortableChannelsList({
  channels,
  onReorder,
  onEdit,
  onDelete,
}: SortableChannelsListProps) {
  const [items, setItems] = useState(channels);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);
      onReorder(newOrder);
    }
  }

  // Update items when channels prop changes
  if (JSON.stringify(items.map(i => i._id)) !== JSON.stringify(channels.map(c => c._id))) {
    setItems(channels);
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Geen kanalen in deze sectie</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((channel) => (
            <SortableChannelItem
              key={channel._id}
              channel={channel}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
} 