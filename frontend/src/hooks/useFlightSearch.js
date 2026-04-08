import { useState } from 'react';
import client from '../api/client';

export function useFlightSearch() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function search(params) {
    setLoading(true);
    setError(null);
    try {
      // Duffel requires a POST to create an offer_request
      const { data } = await client.post('/api/flights/search', params);
      setResults(data); // { passengers: [{id, type}], offers: [...] }
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, search };
}
