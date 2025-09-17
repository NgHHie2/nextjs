// app/ui/documents/preview-cache-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PreviewCacheContextType {
  getPreview: (code: string) => string | null;
  setPreview: (code: string, url: string) => void;
  isLoading: (code: string) => boolean;
  setLoading: (code: string, loading: boolean) => void;
  hasFailed: (code: string) => boolean;
  setFailed: (code: string) => void;
}

const PreviewCacheContext = createContext<PreviewCacheContextType | undefined>(
  undefined
);

export function PreviewCacheProvider({ children }: { children: ReactNode }) {
  const [previewCache, setPreviewCache] = useState<Map<string, string>>(
    new Map()
  );
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(
    new Map()
  );
  const [failedStates, setFailedStates] = useState<Set<string>>(new Set());

  const getPreview = (code: string): string | null => {
    return previewCache.get(code) || null;
  };

  const setPreview = (code: string, url: string) => {
    setPreviewCache((prev) => {
      const newCache = new Map(prev);
      newCache.set(code, url);
      return newCache;
    });
    setLoadingStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(code, false);
      return newStates;
    });
  };

  const isLoading = (code: string): boolean => {
    return loadingStates.get(code) || false;
  };

  const setLoading = (code: string, loading: boolean) => {
    setLoadingStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(code, loading);
      return newStates;
    });
  };

  const hasFailed = (code: string): boolean => {
    return failedStates.has(code);
  };

  const setFailed = (code: string) => {
    setFailedStates((prev) => new Set(prev).add(code));
    setLoadingStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(code, false);
      return newStates;
    });
  };

  return (
    <PreviewCacheContext.Provider
      value={{
        getPreview,
        setPreview,
        isLoading,
        setLoading,
        hasFailed,
        setFailed,
      }}
    >
      {children}
    </PreviewCacheContext.Provider>
  );
}

export function usePreviewCache() {
  const context = useContext(PreviewCacheContext);
  if (context === undefined) {
    throw new Error(
      "usePreviewCache must be used within a PreviewCacheProvider"
    );
  }
  return context;
}
