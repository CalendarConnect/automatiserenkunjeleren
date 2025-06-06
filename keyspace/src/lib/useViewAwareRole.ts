"use client";

import { useCurrentUser, useIsAdmin, useIsModerator } from './useCurrentUser';
import { useViewMode } from '@/contexts/ViewModeContext';

export const useViewAwareAdmin = () => {
  const { isAdmin, isLoading } = useIsAdmin();
  const { isViewingAsMember } = useViewMode();
  
  // If viewing as member, hide admin privileges
  const effectiveIsAdmin = isAdmin && !isViewingAsMember;
  
  return { 
    isAdmin: effectiveIsAdmin, 
    isActualAdmin: isAdmin,
    isViewingAsMember,
    isLoading 
  };
};

export const useViewAwareModerator = () => {
  const { isModerator, isLoading } = useIsModerator();
  const { isViewingAsMember } = useViewMode();
  
  // If viewing as member, hide moderator privileges
  const effectiveIsModerator = isModerator && !isViewingAsMember;
  
  return { 
    isModerator: effectiveIsModerator, 
    isActualModerator: isModerator,
    isViewingAsMember,
    isLoading 
  };
}; 