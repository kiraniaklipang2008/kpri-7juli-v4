
import { useState, useEffect, useCallback } from 'react';
import { PemasukanPengeluaran } from '@/types';
import { getAllPemasukanPengeluaran } from '@/services/keuangan';

// Custom event for cross-component synchronization
const KEUANGAN_UPDATE_EVENT = 'keuangan-data-updated';
const ACCOUNTING_SYNC_EVENT = 'accounting-sync-updated';

// Global event emitter for data synchronization
class KeuanganSyncManager {
  private static instance: KeuanganSyncManager;
  private listeners: Set<() => void> = new Set();

  static getInstance(): KeuanganSyncManager {
    if (!KeuanganSyncManager.instance) {
      KeuanganSyncManager.instance = new KeuanganSyncManager();
    }
    return KeuanganSyncManager.instance;
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(): void {
    this.listeners.forEach(callback => callback());
    // Also dispatch custom events for broader compatibility
    window.dispatchEvent(new CustomEvent(KEUANGAN_UPDATE_EVENT));
    window.dispatchEvent(new CustomEvent(ACCOUNTING_SYNC_EVENT));
  }
}

export function useKeuanganSync() {
  const [data, setData] = useState<PemasukanPengeluaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const syncManager = KeuanganSyncManager.getInstance();

  // Load data function
  const loadData = useCallback(() => {
    try {
      setIsLoading(true);
      const transactions = getAllPemasukanPengeluaran();
      // Sort by date descending (newest first)
      transactions.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      setData(transactions);
      
      // Trigger accounting sync notification
      console.log('Keuangan data loaded, notifying accounting system...');
    } catch (error) {
      console.error('Error loading keuangan data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger data synchronization across all components including accounting
  const triggerSync = useCallback(() => {
    console.log('Triggering sync for both keuangan and accounting systems...');
    syncManager.notify();
  }, [syncManager]);

  // Subscribe to data updates
  useEffect(() => {
    // Initial load
    loadData();

    // Subscribe to sync events
    const unsubscribe = syncManager.subscribe(loadData);

    // Also listen to custom events as fallback
    const handleCustomEvent = () => loadData();
    const handleAccountingSync = () => {
      console.log('Accounting sync event received, refreshing keuangan data...');
      loadData();
    };
    
    window.addEventListener(KEUANGAN_UPDATE_EVENT, handleCustomEvent);
    window.addEventListener(ACCOUNTING_SYNC_EVENT, handleAccountingSync);

    return () => {
      unsubscribe();
      window.removeEventListener(KEUANGAN_UPDATE_EVENT, handleCustomEvent);
      window.removeEventListener(ACCOUNTING_SYNC_EVENT, handleAccountingSync);
    };
  }, [loadData, syncManager]);

  return {
    data,
    isLoading,
    reload: loadData,
    triggerSync
  };
}

// Hook specifically for transaction operations with auto-sync to accounting
export function useKeuanganTransaksiSync() {
  const { data, isLoading, triggerSync } = useKeuanganSync();

  const syncAfterOperation = useCallback(() => {
    // Small delay to ensure data is persisted
    setTimeout(() => {
      console.log('Syncing keuangan changes to accounting...');
      triggerSync();
      
      // Also trigger specific accounting sync event
      window.dispatchEvent(new CustomEvent(ACCOUNTING_SYNC_EVENT, {
        detail: { source: 'keuangan-transaction', timestamp: Date.now() }
      }));
    }, 100);
  }, [triggerSync]);

  return {
    data,
    isLoading,
    syncAfterOperation
  };
}

// Hook for accounting pages to listen to keuangan changes
export function useAccountingKeuanganSync() {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  
  useEffect(() => {
    const handleKeuanganUpdate = () => {
      console.log('Keuangan update received in accounting module');
      setLastUpdate(Date.now());
    };

    const handleAccountingSync = (event: CustomEvent) => {
      console.log('Accounting sync event:', event.detail);
      setLastUpdate(Date.now());
    };

    window.addEventListener(KEUANGAN_UPDATE_EVENT, handleKeuanganUpdate);
    window.addEventListener(ACCOUNTING_SYNC_EVENT, handleAccountingSync as EventListener);

    return () => {
      window.removeEventListener(KEUANGAN_UPDATE_EVENT, handleKeuanganUpdate);
      window.removeEventListener(ACCOUNTING_SYNC_EVENT, handleAccountingSync as EventListener);
    };
  }, []);

  return { lastUpdate };
}
