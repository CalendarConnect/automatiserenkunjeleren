"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, GripVertical } from "lucide-react";

interface Sectie {
  _id: string;
  naam: string;
  emoji: string;
  kleur: string;
  status?: "draft" | "live";
  volgorde: number;
}

interface SortableSectieItemProps {
  sectie: Sectie;
  onEdit: (sectieId: string) => void;
  onDelete: (sectieId: string) => void;
  onToggleStatus?: (sectieId: string) => void;
  showToggle?: boolean;
}

function SortableSectieItem({ sectie, onEdit, onDelete, onToggleStatus, showToggle }: SortableSectieItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectie._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 border border-border rounded-lg bg-white ${
        isDragging ? 'shadow-lg z-10' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <span className="text-2xl">{sectie.emoji}</span>
        <div>
          <h3 className="font-medium text-foreground">
            {sectie.naam}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: sectie.kleur }}
            />
            <span className="text-xs text-muted-foreground">
              {sectie.kleur}
            </span>
            <span className="text-xs text-muted-foreground">
              Volgorde: {sectie.volgorde}
            </span>
            <span className={`text-xs px-2 py-1 rounded text-white ${
              sectie.status === 'live' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              {sectie.status === 'live' ? 'Live' : 'Draft'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showToggle && onToggleStatus && (
          <Button
            variant={(sectie.status || 'draft') === 'live' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleStatus(sectie._id)}
            title={(sectie.status || 'draft') === 'live' ? 'Naar Draft' : 'Naar Live'}
          >
            {(sectie.status || 'draft') === 'live' ? '⬇️' : '⬆️'}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(sectie._id)}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(sectie._id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

interface SortableSectieslListProps {
  secties: Sectie[];
  onReorder: (newOrder: Sectie[]) => void;
  onEdit: (sectieId: string) => void;
  onDelete: (sectieId: string) => void;
  onToggleStatus?: (sectieId: string) => void;
  showToggle?: boolean;
}

export default function SortableSectiesList({ secties, onReorder, onEdit, onDelete, onToggleStatus, showToggle }: SortableSectieslListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = secties.findIndex((item) => item._id === active.id);
      const newIndex = secties.findIndex((item) => item._id === over?.id);

      const newOrder = arrayMove(secties, oldIndex, newIndex);
      onReorder(newOrder);
    }
  }

  if (!secties || secties.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nog geen secties aangemaakt. Maak eerst een sectie aan.
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={secties.map(s => s._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {secties
            .sort((a, b) => a.volgorde - b.volgorde)
            .map((sectie) => (
              <SortableSectieItem
                key={sectie._id}
                sectie={sectie}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                showToggle={showToggle}
              />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  );
} 