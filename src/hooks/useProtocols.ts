import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Protocol, DashboardStats } from '../types';

export function useProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProtocols = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/protocols');
      setProtocols(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar protocolos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  return { protocols, loading, error, refresh: fetchProtocols };
}

export function useProtocolStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/protocols/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}
