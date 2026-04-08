import { useEffect, useState } from 'react';
import client from '../../api/client';

export function SuggestionsList() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get('/api/safira')
      .then(({ data }) => setSuggestions(data.suggestions))
      .catch(() => setError('Falha ao carregar sugestões'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-400 py-8">Carregando sugestões…</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!suggestions.length) return <p className="text-center text-gray-400 py-8">Nenhuma sugestão encontrada.</p>;

  return (
    <div className="flex flex-col gap-4">
      {suggestions.map((s) => (
        <div key={s.conversationId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-mono text-gray-400 mb-3">
            Conversa: {s.conversationId}
          </p>
          <div className="flex flex-col gap-2">
            {s.responses.map((response, i) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
                {response}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
