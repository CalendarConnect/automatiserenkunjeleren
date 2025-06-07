"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ViewModeContextType {
  isViewingAsMember: boolean;
  setViewingAsMember: (viewing: boolean) => void;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [isViewingAsMember, setIsViewingAsMember] = useState(false);

  // Persist view mode in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-view-mode');
    if (saved === 'member') {
      setIsViewingAsMember(true);
    }
  }, []);

  const setViewingAsMember = (viewing: boolean) => {
    setIsViewingAsMember(viewing);
    localStorage.setItem('admin-view-mode', viewing ? 'member' : 'admin');
  };

  const toggleViewMode = () => {
    setViewingAsMember(!isViewingAsMember);
  };

  return (
    <ViewModeContext.Provider value={{
      isViewingAsMember,
      setViewingAsMember,
      toggleViewMode
    }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
} 