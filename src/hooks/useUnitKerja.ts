
import { useState, useEffect } from 'react';
import { UnitKerja } from '@/types/unitKerja';
import { getAllUnitKerja } from '@/services/unitKerjaService';

/**
 * Custom hook to manage unit kerja data
 * @returns Object containing unit kerja data and operations
 */
export function useUnitKerja() {
  const [unitKerjaList, setUnitKerjaList] = useState<UnitKerja[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load unit kerja data
  const loadUnitKerja = () => {
    try {
      const data = getAllUnitKerja();
      setUnitKerjaList(data);
    } catch (error) {
      console.error("Error loading unit kerja data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUnitKerja();
  }, []);

  // Function to refresh unit kerja data
  const refreshUnitKerja = () => {
    setIsLoading(true);
    loadUnitKerja();
  };

  return {
    unitKerjaList,
    isLoading,
    refreshUnitKerja
  };
}
