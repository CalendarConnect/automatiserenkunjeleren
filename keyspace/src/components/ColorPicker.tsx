"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6B7280", // Gray
  "#1F2937", // Dark Gray
  "#7C3AED", // Violet
];

interface ColorPickerProps {
  currentColor?: string;
  onColorSelect: (color: string) => void;
  trigger?: React.ReactNode;
}

export default function ColorPicker({ currentColor, onColorSelect, trigger }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorClick = (color: string) => {
    onColorSelect(color);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded border border-gray-300" 
        style={{ backgroundColor: currentColor || "#3B82F6" }}
      />
      Kleur kiezen
    </Button>
  );

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || defaultTrigger}
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((color) => (
              <Button
                key={color}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full border-2 border-gray-200 hover:border-gray-400"
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
                title={color}
              >
                {currentColor === color && (
                  <span className="text-white text-xs">✓</span>
                )}
              </Button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <input
              type="color"
              value={currentColor || "#3B82F6"}
              onChange={(e) => handleColorClick(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
} 