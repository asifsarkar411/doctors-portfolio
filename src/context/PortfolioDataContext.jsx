'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '@/data/initialData';

const PortfolioDataContext = createContext();

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState({
    profile: initialData.profile,
    themeSettings: initialData.themeSettings,
    services: initialData.services,
    chambers: initialData.chambers,
    schedules: initialData.schedules,
    gallery: initialData.gallery,
    posts: initialData.posts
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/data, using initial state:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSectionLocal = (section, newSectionData) => {
    setData((prev) => ({
      ...prev,
      [section]: newSectionData
    }));
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        loading,
        error,
        refreshData: fetchData,
        updateSectionLocal
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}
