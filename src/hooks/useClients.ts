import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Client } from '../types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      setClients(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refresh: fetchClients };
}

export function useClient(id?: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`/clients/${id}`);
      setClient(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return { client, loading, refresh: fetchClient };
}
