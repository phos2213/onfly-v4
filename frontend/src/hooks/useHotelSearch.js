import { useState } from 'react';
import client from '../api/client';

export function useHotelSearch() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function search(params) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.get('/api/hotels/search', { params });
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, search };
}
