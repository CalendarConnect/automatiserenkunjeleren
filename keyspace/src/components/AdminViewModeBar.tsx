"use client";

import { useViewMode } from '@/contexts/ViewModeContext';
import { useIsAdmin } from '@/lib/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Eye, Shield, X } from 'lucide-react';

export default function AdminViewModeBar() {
  const { isAdmin } = useIsAdmin();
  const { isViewingAsMember, setViewingAsMember } = useViewMode();

  // Only show if user is admin and viewing as member
  if (!isAdmin || !isViewingAsMember) {
    return null;
  }

  return (
    <div className="bg-orange-100 border-b border-orange-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">
              Je bekijkt de community als een gewoon lid
            </span>
          </div>
          <div className="text-sm text-orange-700">
            Admin functies zijn verborgen in deze weergave
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setViewingAsMember(false)}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            Terug naar Admin Modus
          </Button>
          <Button
            onClick={() => setViewingAsMember(false)}
            size="sm"
            variant="ghost"
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 